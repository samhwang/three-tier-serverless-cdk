module.exports = {
    src: './src/',
    schema: '../lambda/src/schema.graphql',
    exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
    watchman: false,
    language: 'typescript',
    extensions: ['ts', 'tsx'],
    artifactDirectory: './src/__generated__',
};
