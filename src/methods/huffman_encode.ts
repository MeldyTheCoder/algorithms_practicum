import { terminal } from "terminal-kit";
import { CodesType, THuffmanMethod } from "../types";
import {writeFileSync} from 'fs';

type HuffmanNode = {
    char: string | null;
    freq: number;
    left?: HuffmanNode;
    right?: HuffmanNode;
};

function buildHuffmanTree(input: string): HuffmanNode {
    const freqMap: { [key: string]: number } = {};

    for (const char of input) {
        freqMap[char] = (freqMap[char] || 0) + 1;
    }

    const nodes: HuffmanNode[] = Object.entries(freqMap).map(([char, freq]) => ({
        char,
        freq,
    }));

    // Построение дерева Хаффмана
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);

        const left = nodes.shift()!;
        const right = nodes.shift()!;
        nodes.push({ char: null, freq: left.freq + right.freq, left, right });
    }

    return nodes[0];
}

function generateCodes(node: HuffmanNode, prefix = '', codes: CodesType = {}): CodesType {
    if (node.char !== null) {
        codes[node.char] = prefix;
    } else {
        if (node.left) generateCodes(node.left, prefix + '0', codes);
        if (node.right) generateCodes(node.right, prefix + '1', codes);
    }
    return codes;
}

function huffman_encode(input: string, filePath: string): string {
    const tree = buildHuffmanTree(input);
    const codes = generateCodes(tree);

    writeFileSync(filePath, JSON.stringify(codes))
    terminal
        .cyan.bold(`\n[!] Таблица кодов записана в `)
        .white(filePath)
        .cyan.bold('.')

    let encoded = '';
    for (const char of input) {
        encoded += codes[char];
    }

    const encodedLength = (new TextEncoder()).encode(encoded).length;

    terminal.yellow.bold(`\n${Object.values(codes).length} ${encodedLength}\n`)
    terminal.grey.bold(Object.entries(codes).map(
        ([symbol, code]) => `'${symbol}': ${code}`).join('\n'),
    )
    terminal.green.bold(`\n${encoded}`);

    return encoded;
}

export default {
    label: "Хаффман | Кодирование",
    fn: huffman_encode,
    type: 'huffman',
} as THuffmanMethod;
