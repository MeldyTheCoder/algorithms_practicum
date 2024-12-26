import { TFibMethod } from "../types";

function fib_eo(n: number): 'even' | 'odd' {
    if (n < 1 || n > 1_000_000) {
        throw new Error('Значение должно быть в диапазоне от 1 до 10^6');
    }

    let a = 0;
    let b = 1;

    for (let i = 2; i <= n; i++) {
        const next = (a + b) % 10;
        a = b;
        b = next;
    }

    const lastDigit = n === 1 ? a : b;
    const result = lastDigit % 2 === 0 ? 'even' : 'odd';

    return result;
}

export default {
    label: "Фибоначчи | Проверка четности числа",
    fn: fib_eo,
    type: 'fib',
} as TFibMethod