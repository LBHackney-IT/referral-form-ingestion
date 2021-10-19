import AWS from 'aws-sdk';

const region = "eu-west-2";

const secretsClient = new AWS.SecretsManager({
    region
});

export const getSecret = (secretName: string) => {
    secretsClient.getSecretValue({SecretId: secretName}, (_, data) => {
        if('SecretString' in data) {
            return data.SecretString;
        }
        if(data.SecretBinary) {
            const buffer = Buffer.from(data.SecretBinary as WithImplicitCoercion<string>, 'base64');
            return buffer.toString('ascii');
        }
    })
}
