function clone<T>(instance: T): T {
    const copy = Object.create(Object.getPrototypeOf(instance));
    Object.assign(copy, instance);
    return copy;
}

export default clone;
