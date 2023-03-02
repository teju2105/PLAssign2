// Token class definition
// Token is a class to represent lexical tokens in the in the PL/0 programming 
// language, described in Algorithms + Data Structures = Programs by
// Niklaus Wirth, Prentice-Hall, 1976.

public class Token {

  private Symbol symbol;	// current token
  private String lexeme;	// lexeme

  public Token () { }

  public Token (Symbol symbol) {
    this (symbol, null);
  }

  public Token (Symbol symbol, String lexeme) {
    this . symbol = symbol;
    this . lexeme  = lexeme;
  }

  public Symbol symbol () { return symbol; }

  public String lexeme () { return lexeme; }

  public String toString () {
    switch (symbol) {
      case PERIOD :    return "(punctuation, .) ";
      case COMMA :     return "(punctuation, ,) ";
      case SEMICOLON : return "(punctuation, ;) ";
      case COLON :     return "(punctuation, :) ";
      case LBRACKET: return "(punctuation, [) ";
      case RBRACKET: return "(punctuation, ]) ";
      case LBRACE : return "(punctuation, {) ";
      case RBRACE: return "(punctuation, }) ";
      case DOUBLE_COLON: return "(punctuation, ::) ";
      case ASSIGN :    return "(operator, :=) ";
      case EQ :        return "(operator, =) ";
      case NE :        return "(operator, <>) ";
      case LT :        return "(operator, <) ";
      case GT :        return "(operator, >) ";
      case LE :        return "(operator, <=) ";
      case GE :        return "(operator, >=) ";
      case PLUS :      return "(operator, +) ";
      case MINUS :     return "(operator, -) ";
      case TIMES :     return "(operator, *) ";
      case DIV:     return "(operator, /) ";
      case LPAREN :    return "(operator, () ";
      case RPAREN :    return "(operator, )) ";
      case OR :    return "(operator, ||) ";
      case AND :    return "(operator, &&) ";
      case NOT :    return "(operator, !) ";
      case UNDERSCORE :     return "(operator, _) ";
      case ISEMPTY :   return "(operator, isEmpty) ";
      case TAIL :   return "(operator, tail) ";
      case HEAD :   return "(operator, head) "; 
      case BEGIN :     return "(keyword, begin) ";
      case CALL :      return "(keyword, call) ";
      case CONST :     return "(keyword, const) ";
      case DO :        return "(keyword, do) ";
      case END :       return "(keyword, end) ";
      case IF :        return "(keyword, if) ";
      case ELSE :      return "(keyword, else) ";
      case OBJECT:     return "(keyword, object) ";
      case DEF :      return "(keyword, def) ";
      case MAIN :     return "(keyword, main) ";
      case ARGS :     return "(keyword, args) ";
      case VAR :        return "(keyword, var) ";
      case INT :       return "(keyword, int) ";
      case ODD :       return "(keyword, odd) ";
      case PROC :      return "(keyword, proc) ";
      case THEN :      return "(keyword, then) ";
      case WHILE :     return "(keyword, while) ";
      case LIST :      return "(keyword, list) ";
      case PRINTLN :       return "(keyword, println) ";
      case NIL :   return "(keyword, nil) ";
      case STRING :   return "(keyword, string) ";
      case BOOLEAN:   return "(keyword, boolean) ";
      case READINT :   return "(keyword, readint) ";
      case STDIN :   return "(keyword, stdin) ";
      case ARRAY :   return "(keyword, array) ";
      case SCALA :     return "(keyword, scala) ";
      case RETURN :     return "(keyword, return) ";
      case IO :     return "(keyword, io) ";
      case SCALA_PERIOD_IO_PERIOD_STDIN_PERIOD_READINT:   return "(keyword, scala.io.stdin.readint) ";
      case ID :        return "(identifier, " + lexeme + ") ";
      case INTEGER :   return "(integer, " + lexeme + ") ";      
      default : 
	ErrorMessage . print (0, "Unrecognized token");
        return null;
    }
  }

}
