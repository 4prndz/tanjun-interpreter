import { Identifier, LetStatement, Program, Statement } from "../ast/ast";
import { Lexer } from "../lexer/lexer";
import { Token, TokenType, TokenTypes } from "../token/token";

export class Parser {
  private lexer: Lexer;
  private curToken?: Token;
  private peekToken?: Token;
  private errors: string[];

  private constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
  }

  public static new(lexer: Lexer): Parser {
    const parser = new Parser(lexer);
    parser.nextToken();
    parser.nextToken();

    return parser;
  }

  private nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  public parseProgram(): Program {
    const program = Program.new();

    while (!this.curTokenIs(TokenTypes.EOF)) {
      const statement = this.parseStatement();
      if (statement) {
        program.statements.push(statement);
      }
      this.nextToken();
    }
    return program;
  }

  private parseStatement(): Statement | null {
    switch (this.curToken?.type) {
      case TokenTypes.LET:
        return this.parserLetStatement();
      default:
        return null;
    }
  }

  private parserLetStatement(): LetStatement | null {
    const statement = LetStatement.new(this.curToken!);
    if (!this.expectPeek(TokenTypes.IDENT)) {
      return null;
    }

    statement.name = Identifier.new(this.curToken!, this.curToken?.literal);

    if (!this.expectPeek(TokenTypes.ASSIGN)) {
      return null;
    }

    while (!this.curTokenIs(TokenTypes.SEMICOLON)) {
      this.nextToken();
    }

    return statement;
  }

  private curTokenIs(token: TokenType): boolean {
    return this.curToken?.type === token;
  }

  private expectPeek(token: TokenType): boolean {
    if (this.peekTokenIs(token)) {
      this.nextToken();
      return true;
    }
    this.peekErrors(token);
    return false;
  }

  private peekTokenIs(token: TokenType): boolean {
    return this.peekToken?.type === token;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  private peekErrors(token: TokenType) {
    const msg = `expected token to be ${token}, got ${this.peekToken?.type} instead`;
    this.errors.push(msg);
  }
}
