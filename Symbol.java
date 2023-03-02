// Symbol enumeration definition
// Symbol is an enumeration to represent lexical token classes in the PL/0 
// programming language, described in Algorithms + Data Structures = Programs by
// Niklaus Wirth, Prentice-Hall, 1976.

public enum Symbol {
  EOF, 
  // punctuation
  PERIOD, COMMA, SEMICOLON, COLON, LBRACKET, RBRACKET, LBRACE, RBRACE, DOUBLE_COLON,
  // operators
  ASSIGN, OR, AND, NOT, NEQ, EQ, NE, LT, GT, LE, GE, PLUS, MINUS, TIMES, DIV, LPAREN, RPAREN, ISEMPTY, TAIL, HEAD, UNDERSCORE,     
  // keywords
  OBJECT, IF, VAR, WHILE, DEF, MAIN, ARGS, INT, ELSE, PRINTLN, NIL, SCALA, STRING, READINT, STDIN, ARRAY, RETURN, IO, LIST, CALL, CONST, DO, END, BEGIN, PROC, ODD, THEN, BOOLEAN,SCALA_PERIOD_IO_PERIOD_STDIN_PERIOD_READINT,
  // ids and integers
  ID, INTEGER
}

