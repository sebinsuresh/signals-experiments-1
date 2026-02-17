import { signal, computed } from './signal.js';

function test(name, fn) {
    let output = "";
    try {
        output = fn();

        console.log(`✅ ${name}`);
        if (output) console.log(output);
    } catch (e) {
        console.log(`❌ ${name}`);
        if (output) console.log(output);

        console.error(e);
    }
    console.log("-------------------");
}

test("signal set updates value", () => {
    const signal1 = signal(1);
    let output = `signal1: ${signal1()}\n`;

    signal1.set(42);
    output += `(updating value on signal1...)\n`;

    const currentVal = signal1();
    output += `signal1: ${currentVal}`;
    if (currentVal !== 42) throw new Error(`Expected 42, got ${currentVal}`);

    return output;
});

test("computed1 returns initial value (signal1 + 1)", () => {
    const signal1 = signal(1);
    const computed1 = computed(() => signal1() + 1);

    const currentVal = computed1();
    let output = `computed1 (signal1 + 1): ${currentVal}`;
    if (currentVal !== 2) throw new Error(`Expected 2, got ${currentVal}`);

    return output;
});

test("computed1 updates when signal1 changes", () => {
    const signal1 = signal(1);
    const computed1 = computed(() => signal1() + 1);

    signal1.set(5);
    let output = `(updating value on signal1...)\n`;
    output += `signal1: ${signal1()}\n`;

    const currentVal = computed1();
    output += `computed1 (signal1 + 1): ${currentVal}`;
    if (currentVal !== 6) throw new Error(`Expected 6, got ${currentVal}`);

    return output;
});

test("computed1 does not allow set", () => {
    const signal1 = signal(1);
    const computed1 = computed(() => signal1() + 1);

    let threw = false;
    let output = "";
    try {
        computed1.set(10);
    } catch (e) {
        threw = true;
        output = `Caught error: ${e.message}`;
    }
    if (!threw) throw new Error("Expected error when setting computed1");

    return output;
});
