import { upsertRecord, Record, removeRecord } from './records'
import { S3Event, S3EventRecord, S3Handler } from 'aws-lambda'
import { HeadObjectOutput } from 'aws-sdk/clients/s3'
import AWS from 'aws-sdk'

const s3 = new AWS.S3()

export const handler: S3Handler = async (event: S3Event) => {
  console.log('EVENT', JSON.stringify(event, null, 2))

  try {
    for (const s3Object of event.Records) {
      const label = s3Object.eventName.includes('ObjectCreated')
      
      if (s3Object.eventName.includes('ObjectCreated')) {
        await tryCreateOrUpdate(s3Object)
      } else if (s3Object.eventName.includes('ObjectRemoved')) {
        await tryRemoveRecord(s3Object)
      }
    }
  } catch (error) {
    console.error('Error processing S3 event:', error)
  }
}

const tryCreateOrUpdate = async (s3Object: S3EventRecord) => {
  try {
    const objectKey = s3Object.s3.object.key
    const keySegments = objectKey.split('/')

    const params = {
      Bucket: s3Object.s3.bucket.name,
      Key: s3Object.s3.object.key
    }

    const data: HeadObjectOutput = await s3.headObject(params).promise()

    console.log('DATA', JSON.stringify(data, null, 2))

    const record: Record = {
      id: keySegments[1],
      name: data.Metadata!['record-name'] ?? null,
      type: data.Metadata!['record-type'] ?? null,
      owner: keySegments[0],
      size: s3Object.s3.object.size,
      createdAt: new Date(),
      updatedAt: null,
      expirationAt: new Date(data.Metadata!['record-expiration']) ?? null
    }

    await upsertRecord(record)
  } catch (error) {
    console.error('Error inserting S3 object:', error)
    console.error(s3Object)
  }
}

const tryRemoveRecord = async (s3Object: S3EventRecord) => {
  try {
    const objectKey = s3Object.s3.object.key
    const keySegments = objectKey.split('/')
    await removeRecord(keySegments[1])
  } catch (error) {
    console.error('Error removing S3 object:', error, s3Object)
    console.error(s3Object)
  }
}
