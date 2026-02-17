const signalObjs = new Set();
let activeComputedStack = [];

export const signal = (value) => {
    const signalObj = {
        value: value,
        subscribers: new Set(),
    };

    signalObjs.add(signalObj);

    const toReturn = () => {
        if (activeComputedStack.length) {
            const activeComputed = activeComputedStack[activeComputedStack.length - 1];
            assertValidComputed(activeComputed)
            signalObj.subscribers.add(activeComputed);
        }

        return signalObj.value;
    };

    toReturn.set = (newValue) => {
        signalObj.value = newValue;
        signalObj.subscribers.forEach((comp) => {
            comp._update();
        });
    };

    return toReturn;
};

export const assertValidComputed = (obj) => {
    if (!obj._update) {
        throw new Error("invalid computed object");
    }
};

export const computed = (callback) => {
    if (!callback || typeof callback !== "function") {
        throw new Error("cannot create computed without a callback that returns initial value");
    }

    const computedObj = {
        value: null,
        subscribers: new Set(),
    };
    computedObj._update = () => {
        computedObj.value = callback();
        computedObj.subscribers.forEach((comp) => {
            comp._update();
        });
    };

    activeComputedStack.push(computedObj);
    computedObj.value = callback();
    activeComputedStack.pop();

    const toReturn = () => {
        return computedObj.value;
    };
    toReturn.set = () => {
        throw new Error("cannot set value on computed");
    };
    return toReturn;
};

import('./signal.test.js').catch((err) => {
    console.error(err);
    process.exitCode = 1;
});