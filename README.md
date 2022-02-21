# Node template

### Setup
#### Repository
- Search and replace `node-template` with your repository name
- Make package publically available [here](https://github.com/users/hense94/packages/container/node-template/settings)
 
#### Sentry
- Add new project to organization with the same name as this repo
- Add this repo to the GitHub integration in Sentry

##### GitHub
- Add secrets [here](https://github.com/hense94/node-template/settings/secrets/actions/new)
    - `GHCR_PAT` [generate](https://github.com/settings/tokens/new?description=GHCR_node-template&scopes=write:packages%2Cdelete:packages)
    - `SENTRY_AUTH_TOKEN` Github release integration token from Sentry 