const passthroughDecorator = () => () => undefined;

module.exports = {
    field: passthroughDecorator,
    text: passthroughDecorator,
    date: passthroughDecorator,
    json: passthroughDecorator,
    readonly: () => undefined,
};
