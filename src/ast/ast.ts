import { Token } from "../token/token";

interface ASTNode {
  tokenLiteral(): string;
}

export interface Statement extends ASTNode {
  statementNode(): void;
}

interface Expression extends ASTNode {
  expressionNode(): void;
}

export class Program implements ASTNode {
  public statements: Statement[];

  private constructor(statements: Statement[]) {
    this.statements = statements;
  }

  public static new(): Program {
    return new Program([]);
  }

  public tokenLiteral(): string {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    }
    return "";
  }
}

export class LetStatement implements Statement {
  private token: Token;
  name?: Identifier;
  private value?: Expression;

  private constructor(token: Token) {
    this.token = token;
  }

  public static new(token: Token) {
    return new LetStatement(token);
  }

  public statementNode(): void {}

  public tokenLiteral(): string {
    return this.token.literal;
  }
}

export class Identifier implements Expression {
  private token: Token;
  value?: string;

  private constructor(token: Token, value?: string) {
    this.token = token;
    this.value = value;
  }

  public static new(token: Token, value?: string): Identifier {
    return new Identifier(token, value);
  }

  public expressionNode(): void {}

  public tokenLiteral(): string {
    return this.token.literal;
  }
}
