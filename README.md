# line-bot

- cloud functions on GCP

## deploy

```shell
gcloud beta functions deploy [function-name] --runtime=nodejs8 --trigger-http \
  --set-env-vars="CHANNEL_SECRET"="[your secret]","CHANNEL_ACCESS_TOKEN"="[your access token]"
```