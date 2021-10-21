import { getDataFromS3 } from "./getDataFromS3";
import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { S3Event, SQSEvent } from "aws-lambda";

describe("#getDataFromS3()", () => {
    const mockS3 = mockClient(S3Client);

    const mockS3Event = {
        Records: [
            {
                s3: {
                    bucket: {
                        name: "test-bucket",
                    },
                    object: {
                        key: "test-object-key",
                    },
                },
            },
        ],
    } as S3Event;

    const mockSQSEvent = {
        Records: [
            {
                body: JSON.stringify(mockS3Event),
            },
        ],
    } as SQSEvent;

    beforeEach(() => {
        mockS3.reset();
    });

    it("should make a call to S3 when the lambda receives an event notification", async () => {
        mockS3.on(GetObjectCommand).resolves({
            Body: new Readable({
                read() {
                    this.push(JSON.stringify([{}]));
                    this.push(null);
                },
            }),
        });

        await getDataFromS3(mockSQSEvent);

        expect(mockS3.calls()).toHaveLength(1);
    });

    it("should call the S3 get object command using details from the event", async () => {
        mockS3.on(GetObjectCommand).resolves({
            Body: new Readable({
                read() {
                    this.push(JSON.stringify([{}]));
                    this.push(null);
                },
            }),
        });

        const expectedCommandInput = {
            Bucket: "test-bucket",
            Key: "test-object-key",
        };

        await getDataFromS3(mockSQSEvent);

        const receivedCommandInput = mockS3.calls()[0].args[0].input;

        expect(receivedCommandInput).toStrictEqual(expectedCommandInput);
    });

    it("should receive the form data from S3 if getObject is successful", async () => {
        const mockFormData = {
            id: "100",
            data: "hello",
        };

        mockS3
            .on(GetObjectCommand, {
                Bucket: "test-bucket",
                Key: "test-object-key",
            })
            .resolves({
                Body: new Readable({
                    read() {
                        this.push(JSON.stringify([mockFormData]));
                        this.push(null);
                    },
                }),
            });

        expect(await getDataFromS3(mockSQSEvent)).toStrictEqual([mockFormData]);
    });

    it("should loop through multiple messages in the SQS event", async () => {
        const secondMockS3Event = {
            Records: [
                {
                    s3: {
                        bucket: {
                            name: "Hello",
                        },
                        object: {
                            key: "Peace",
                        },
                    },
                },
            ],
        } as S3Event;

        const mockMultipleSQSMessageEvent = {
            Records: [
                {
                    body: JSON.stringify(mockS3Event),
                },
                {
                    body: JSON.stringify(secondMockS3Event),
                },
            ],
        } as SQSEvent;

        mockS3.on(GetObjectCommand).resolves({
            Body: new Readable({
                read() {
                    this.push(JSON.stringify([{}]));
                    this.push(null);
                },
            }),
        });

        await getDataFromS3(mockMultipleSQSMessageEvent);

        expect(mockS3.calls()).toHaveLength(2);
    });
});
