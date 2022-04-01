module.exports = {
    src: './src/',
    schema: '../lambda/src/schema.graphql',
    excludes: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
    language: 'typescript',
};
