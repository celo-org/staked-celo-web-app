import { describe, expect, test } from "vitest"

import { Token } from "src/utils/tokens"


describe('Token', () => {
  describe('toBigInt', () => {
    test('it converts to BigInt', () => {
      expect(new Token(1).toBigInt()).toEqual(1n);
    });
    test('it converts very large number BigInt', () => {
      expect(new Token('123456789000000000000000000').toBigInt()).toEqual(123456789000000000000000000n);
    })
  })
  describe('convertToBase', () => {
    test('it converts to base', () => {
      expect(new Token(1).convertToBase().toString()).toEqual('1e-18');
    });
    test('it converts very large number to base', () => {
      expect(new Token('123456789000000000000000000').convertToBase().toString()).toEqual('123456789');
    })
  })
  describe('displayAsBase', () => {
    test('displays ver small numbers as we think about them', () => {
      expect(new Token("100000").displayAsBase()).toEqual('0.0000');
    });
    test('displays numbers as we think about them', () => {
      expect(new Token("1234567890000000000").displayAsBase()).toEqual('1.2345');
    });
    test('displays big numbers as we think about them', () => {
      expect(new Token("123456789101112131400000").displayAsBase()).toEqual('123,456.7891');
    });
  })
})
