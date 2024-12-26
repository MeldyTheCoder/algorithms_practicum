import { TFibMethod } from "../types";

function fib(n: number): number {
  if (n < 1 || n > 64) {
    throw new Error("Значение должно быть не менее 1 и не более 64");
  }
  const sqrt5 = Math.sqrt(5);
  const phi = (1 + sqrt5) / 2;
  const psi = (1 - sqrt5) / 2;

  const fibNumber = Math.round((Math.pow(phi, n) - Math.pow(psi, n)) / sqrt5);
  return fibNumber;
}

export default {
    label: "Фибоначчи | Метод Бине",
    fn: fib,
    type: 'fib',
} as TFibMethod
