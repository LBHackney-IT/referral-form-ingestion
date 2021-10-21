import AWS from 'aws-sdk';

export const getSecret = (secretName: string) => {

    const region = "eu-west-2";

    const secretsClient = new AWS.SecretsManager({
        region
    });

    let secretValue = '';

    secretsClient.getSecretValue({SecretId: secretName}, (_, data) => {
        if('SecretString' in data) {
            secretValue = data.SecretString || '';
        }else if(data.SecretBinary) {
            const buffer = Buffer.from(data.SecretBinary as WithImplicitCoercion<string>, 'base64');
            secretValue = buffer.toString('ascii');
        }
    })

    return secretValue;
}
