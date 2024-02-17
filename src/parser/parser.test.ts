import { LetStatement, Statement } from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";

describe("Parser", () => {
  it("should return let statement", () => {
    const input = `let x = 5; 
                  let y = 10;
                  let foobar = 1337;
    `;

    const lexer = Lexer.new(input);
    const parser = Parser.new(lexer);
    const program = parser.parseProgram();

    expect(checkParserErrors(parser)).toBeFalsy();
    expect(program).toBeDefined();
    expect(program?.statements).toHaveLength(3);

    const tests = ["x", "y", "foobar"];

    tests.forEach((expected, index) => {
      const statement = program?.statements[index];
      expect(testLetStatement(statement, expected)).toBeTruthy();
    });
  });
});

function testLetStatement(statement: Statement, expected?: string): boolean {
  if (
    !statement ||
    statement.tokenLiteral() !== "let" ||
    !(statement instanceof LetStatement) ||
    statement.name?.value !== expected ||
    statement.name?.tokenLiteral() !== expected
  ) {
    return false;
  }

  return true;
}

function checkParserErrors(parser: Parser): boolean {
  const errors = parser.getErrors();
  console.log(`parser has ${errors.length} errors`);
  for (const error of errors) {
    console.log(`parser error: ${error}`);
  }
  return errors.length > 0 ? true : false;
}
