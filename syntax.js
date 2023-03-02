// SyntaxAnalyzer implementation
// SyntaxAnalyzer is a class to represent a recursive descent parser for the 
// PL/0 programming language, described in Algorithms + Data Structures = 
// Programs by Niklaus Wirth, Prentice-Hall, 1976.

import java.io.*;

public class SyntaxAnalyzer {

  protected PL0Lexer lexer;	// lexical analyzer
  protected Token token;	// current token

  public SyntaxAnalyzer () throws IOException {
    lexer = new PL0Lexer (new InputStreamReader (System . in));
    getToken ();           	// get first token
  }

  private void getToken () throws IOException { 
    token = lexer . nextToken (); 
  }

  // <program> ::= <block> . 

  public void program () throws IOException {
    block ();                                	// <block>
    if (token . symbol () != Symbol . PERIOD) 	// .
      ErrorMessage . print (lexer . position (), ". EXPECTED");
  }

  // <block> ::= <const-decl> <var-decl> <proc-decl> <statement> 
  // <const-decl> ::= [const <ident> = <integer> {, <ident> = <integer>} ;] 
  // <var-decl> ::= [var <ident> {, <ident>} ;] 
  // <proc-decl> ::= {procedure <ident> ; <block> ;} 

  public void block () throws IOException {
    if (token . symbol () == Symbol . CONST) { 	// [ const
      getToken ();
      constDeclaration ();               	// <ident> = <integer>
      while (token . symbol () == Symbol . COMMA) {  // { ,
	getToken ();
	constDeclaration ();              	// <ident> = <integer> }
      }
      if (token . symbol () == Symbol . SEMICOLON)  // ;]
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), ", OR ; EXPECTED");
    }
    if (token . symbol () == Symbol . VAR) { 	// [var
      getToken ();
      varDeclaration ();                  	// <ident>
      while (token . symbol () == Symbol . COMMA) { // {, 
	getToken ();
	varDeclaration ();                	// <ident>}
      }
      if (token . symbol () == Symbol . SEMICOLON)  // ;]
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), ", OR ; EXPECTED");
    }
    while (token . symbol () == Symbol . PROC) {  // {procedure 
      getToken ();
      if (token . symbol () == Symbol . ID)  	  // <ident> 
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), "ID EXPECTED");
      if (token . symbol () == Symbol . SEMICOLON)  // ;
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), "; EXPECTED");
      block ();                             	    // <block> 
      if (token . symbol () == Symbol . SEMICOLON)  // ; 
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), "; EXPECTED");
    }                                               // }
    statement ();                                   // <statement>
  }

  // <ident> = <integer> 

  public void constDeclaration () throws IOException {
    if (token . symbol () == Symbol . ID) { 	// <ident> 
      getToken ();
      if (token . symbol () == Symbol . EQ) { 	// = 
        getToken ();
        if (token . symbol () == Symbol . INTEGER)  // <integer> 
          getToken ();
        else 
          ErrorMessage . print (lexer . position (), "Integer expected");
      }
      else ErrorMessage . print (lexer . position (), "= expected");
    }
    else ErrorMessage . print (lexer . position (), "id expected");
  }

  // <ident>

  public void varDeclaration () throws IOException {
    if (token . symbol () == Symbol . ID) 	// <ident>
      getToken ();
    else 
      ErrorMessage . print (lexer . position (), "ID EXPECTED");
  }

  // <statement> ::= <ident> := <expression>
  //               | call <ident>
  //               | begin <statement> {; <statement>} end
  //               | if <condition> then <statement>
  //               | while <condition> do <statement>
  //               | ε

  public void statement () throws IOException {
    switch (token . symbol ()) {

      case ID :                                  	// <ident>
        getToken ();
        if (token . symbol () == Symbol . ASSIGN)  	// :=
          getToken ();
        else 
          ErrorMessage . print (lexer . position (), ":= EXPECTED");
        expression ();                             	// <expression>
        break;

      case CALL :                                 	// call
        getToken ();
        if (token . symbol () != Symbol . ID)      	// <ident>
	  ErrorMessage . print (lexer . position (), "ID EXPECTED");
        else {
          getToken ();
        }
        break;

      case IF :                                   	// if
        getToken ();
        condition ();                             	// <condition>
        if (token . symbol () == Symbol . THEN)    	// then
          getToken ();
        else 
          ErrorMessage . print (lexer . position (), "THEN EXPECTED");
        statement ();                               	// <statement>
        break;

      case BEGIN :                                 	// begin
        getToken ();
        statement ();                              	// <statement>
        while (token . symbol () == Symbol . SEMICOLON) {  // {; 
	  getToken ();
	  statement ();                            	// <statement>}
	}
        if (token . symbol () == Symbol . END)    	// end
          getToken ();
        else 
          ErrorMessage . print (lexer . position (), "END OR ; EXPECTED");
        break;

      case WHILE :                                 	// while
        getToken ();
        condition ();                             	// <condition>
        if (token . symbol () == Symbol . DO)     	// do
          getToken ();
        else 
          ErrorMessage . print (lexer . position (), "DO EXPECTED");
        statement ();                            	// <statement>
        break;

      default : break;                            	// ε

    }
  }

  // <condition> ::= odd <expression>
  //               | <expression> <relation> <expression>
  // <relation> ::= = | <> | < | > | <= | >=

  public void condition () throws IOException {
    if (token . symbol () == Symbol . ODD) { 	// odd
      getToken ();
      expression ();                      	// <expression>
    }
    else {
      expression ();                     	// <expression>
      switch (token . symbol ()) {        	// <relation>
        case EQ : 
	case LT : 
	case GT : 
	case NE : 
	case LE : 
	case GE :
          getToken ();
	  expression ();                	// <expression>
	  break;
        default : 
	  ErrorMessage . print 
	    (lexer . position (), "RELATIONAL OPERATOR EXPECTED");
      }
    }
  }

  // <expression> ::= [<adding-operator>] <term> {<adding-operator> <term>}
  // <adding-operator> ::= + | -

  public void expression () throws IOException {
    if (token . symbol () == Symbol . PLUS || 	 // <adding-operator>
	token . symbol () == Symbol . MINUS) { 
      getToken ();
      term ();                           	 // <term>
    } 
    else 
      term ();                                   // <term>
    while (token . symbol () == Symbol . PLUS || // {<adding-operator>
	token . symbol () == Symbol . MINUS) {
      getToken ();
      term ();                                   // <term>}
    }
  }

  // <term> ::= <factor> {<multiplying-operator> <factor>}
  // <multiplying-operator> ::= * | / 

  public void term () throws IOException {
    factor ();                             	  // <factor>
    while (token . symbol () == Symbol . TIMES || // {<multiplying-operator>
	token . symbol () == Symbol . DIV) { 
      getToken ();
      factor ();                                  // <factor>}
    }
  }

  // <factor> ::= <ident> | <integer> | ( <expression> ) 

  public void factor () throws IOException {
    if (token . symbol () == Symbol . ID)         	// <ident>
      getToken ();
    else if (token . symbol () == Symbol . INTEGER)  	// <integer>
      getToken ();
    else if (token . symbol () == Symbol . LPAREN) { 	// (
      getToken ();
      expression ();                              	// <expression>
      if (token . symbol () == Symbol . RPAREN)  	// )
        getToken ();
      else 
        ErrorMessage . print (lexer . position (), "MISSING )");
    }
    else ErrorMessage . print (lexer . position (), "UNRECOGNIZABLE SYMBOL");
  }
  
// <CompilationUnit> ::= object id { {Def} MainDef }
  
public void compilationUnit() throws IOException {
  if (token.symbol() == Symbol.OBJECT) { // object
    getToken();
    if (token.symbol() == Symbol.ID) { // id
      getToken();
      if (token.symbol() == Symbol.LBRACE) { // {
        getToken();
        while (token.symbol() == Symbol.DEF) { // {Def}
          def();
        }
        mainDef(); // MainDef
        if (token.symbol() == Symbol.RBRACE) { // }
          getToken();
          if (token.symbol() != Symbol.EOF) { // not end of file
            ErrorMessage.print(lexer.position(), "END OF FILE EXPECTED");
          }
        } else {
          ErrorMessage.print(lexer.position(), "} EXPECTED");
        }
      } else {
        ErrorMessage.print(lexer.position(), "{ EXPECTED");
      }
    } else {
      ErrorMessage.print(lexer.position(), "IDENTIFIER EXPECTED");
    }
  } else {
    ErrorMessage.print(lexer.position(), "OBJECT EXPECTED");
  }
}


// Parses a list of formal arguments for a method
private void formalArgList() throws IOException {
  if (token.symbol() == Symbol.LPAREN) {
    getToken();
    if (token.symbol() == Symbol.ID) {
      // Parse the first argument
      getToken();
      if (token.symbol() == Symbol.COLON) {
        // Parse the type of the first argument
        getToken();
        type();
        while (token.symbol() == Symbol.COMMA) {
          // Parse additional arguments
          getToken();
          if (token.symbol() == Symbol.ID) {
            // Parse the next argument
            getToken();
            if (token.symbol() == Symbol.COLON) {
              // Parse the type of the next argument
              getToken();
              type();
            } else {
              ErrorMessage.print(lexer.position(), ": EXPECTED");
              break;
            }
          } else {
            ErrorMessage.print(lexer.position(), "IDENTIFIER EXPECTED");
            break;
          }
        }
      } else {
        ErrorMessage.print(lexer.position(), ": EXPECTED");
      }
      if (token.symbol() == Symbol.RPAREN) {
        getToken();
      } else {
        ErrorMessage.print(lexer.position(), ") EXPECTED");
      }
    } else {
      ErrorMessage.print(lexer.position(), "IDENTIFIER EXPECTED");
    }
  } else {
    ErrorMessage.print(lexer.position(), "( EXPECTED");
  }
}



// Def ::= def id ( {FormalArgList} ) : Type = Expr ;

public void def() throws IOException {
if(token.symbol() == Symbol.DEF){ // def
getToken();
if(token.symbol() == Symbol.ID){ // id
getToken();
if(token.symbol() == Symbol.LPAREN){ // (
getToken();
if(token.symbol() != Symbol.RPAREN){ // {FormalArgList}
formalArgList();
}
if(token.symbol() == Symbol.RPAREN){ // )
getToken();
if(token.symbol() == Symbol.COLON){ // :
getToken();
type(); // Type
if(token.symbol() == Symbol.ASSIGN){ // =
getToken();
expr(); // Expr
if(token.symbol() == Symbol.SEMICOLON){ // ;
getToken();
}else{
ErrorMessage.print(lexer.position(), "; EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "= EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), ": EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), ") EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "( EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "IDENTIFIER EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "DEF EXPECTED");
}
}


public void varDef() throws IOException {
if (token.symbol() == Symbol.VAR) { // var
getToken();
if (token.symbol() == Symbol.ID) { // id
getToken();
if (token.symbol() == Symbol.COLON) { // :
getToken();
type(); // Type
if (token.symbol() == Symbol.EQ) { // =
getToken();
expression(); // Expr
if (token.symbol() == Symbol.SEMICOLON) { // ;
getToken();
} else {
ErrorMessage.print(lexer.position(), "; EXPECTED");
}
} else {
ErrorMessage.print(lexer.position(), "= EXPECTED");
}
} else {
ErrorMessage.print(lexer.position(), ": EXPECTED");
}
} else {
ErrorMessage.print(lexer.position(), "IDENTIFIER EXPECTED");
}
} else {
ErrorMessage.print(lexer.position(), "VAR EXPECTED");
}
}		


// MainDef ::= def main ( args : Array [ String ] ) { {VarDef} Statement {Statement} }

public void mainDef() throws IOException{
if(token.symbol() == Symbol.DEF){ // def
getToken();
if(token.symbol() == Symbol.MAIN){ // main
getToken();
if(token.symbol() == Symbol.LPAREN){ // (
getToken();
if(token.symbol() == Symbol.ARGS){ // args
getToken();
if(token.symbol() == Symbol.COLON){ // :
getToken();
if(token.symbol() == Symbol.ARRAY){ // Array
getToken();
if(token.symbol() == Symbol.LBRACKET){ // [
getToken();
if(token.symbol() == Symbol.STRING){ // String
getToken();
if(token.symbol() == Symbol.RBRACKET){ // ]
getToken();
if(token.symbol() == Symbol.RPAREN){ // )
getToken();
if(token.symbol() == Symbol.LBRACE){ // {
getToken();
while(token.symbol() == Symbol.VAR){ // {VarDef}
varDef();
}
statement(); // Statement
while(token.symbol() == Symbol.IF || token.symbol() == Symbol.WHILE ||
token.symbol() == Symbol.ID || token.symbol() == Symbol.PRINTLN ||
token.symbol() == Symbol.LBRACE){ // {Statement}
statement();
}
if(token.symbol() == Symbol.RETURN){ // return
getToken();
listExpr(); // ListExpr
if(token.symbol() == Symbol.SEMICOLON){ // ;
getToken();
}else{
ErrorMessage.print(lexer.position(), "; EXPECTED");
}
}
if(token.symbol() == Symbol.RBRACE){ // }
getToken();
}else{
ErrorMessage.print(lexer.position(), "} EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "{ EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), ") EXPECTED");
}
}else{
ErrorMessage.print(lexer.position(), "] EXPECTED");
}
}
}
}
}
}
}
}
}
}
	
//Type ::= Int | List [ Int ]
	
private void type() throws IOException {
    
    if (token.symbol() == Symbol.INT) {
        
        getToken();
    } else if (token.symbol() == Symbol.LIST) {
        getToken();
        if (token.symbol() == Symbol.LBRACKET) {
            getToken();
            if (token.symbol() == Symbol.INT) {
                
                getToken();
                if (token.symbol() == Symbol.RBRACKET) {
                    getToken();
                } else {
                    ErrorMessage.print(lexer.position(), "] EXPECTED");
                }
            } else {
                ErrorMessage.print(lexer.position(), "INT EXPECTED");
            }
        } else {
            ErrorMessage.print(lexer.position(), "[ EXPECTED");
        }
    } else {
        ErrorMessage.print(lexer.position(), "TYPE EXPECTED");
    }    
}

//Expr ::= AndExpr {|| AndExpr}
public void expr() throws IOException {
  andExpr();
  while (token.symbol() == Symbol.OR) {
    getToken();
    andExpr();
  }
}

//AndExpr ::= RelExpr {&& RelExpr}
public void andExpr() throws IOException {
  relExpr();
  while (token.symbol() == Symbol.AND) {
    getToken();
    relExpr();
  }
}

//RelExpr ::= [!] ListExpr [RelOper ListExpr]

public void relExpr() throws IOException {
  if (token.symbol() == Symbol.NOT) {
    getToken();
  }
  listExpr();
  if (isRelationalOperator()) {
    relOper();
    listExpr();
  }
}

private boolean isRelationalOperator() {
  Symbol sym = token.symbol();
  return sym == Symbol.LT || sym == Symbol.LE || sym == Symbol.GT
      || sym == Symbol.GE || sym == Symbol.EQ || sym == Symbol.NE;
}


private void relOper() throws IOException {
  Symbol sym = token.symbol();
  if (isRelationalOperator()) {
    getToken();
  } else {
    ErrorMessage . print (lexer . position (), "Relational operator expected");
  }
}



// ListExpr ::= AddExpr | AddExpr :: ListExpr
public void listExpr() throws IOException {
  addExpr();
  while (token.symbol() == Symbol.DOUBLE_COLON) {
    getToken();
    listExpr();
  }
}

// AddExpr ::= MulExpr {AddOper MulExpr}

public void addExpr() throws IOException {
  mulExpr();
  while (token.symbol() == Symbol.PLUS || token.symbol() == Symbol.MINUS) {
    getToken();
    mulExpr();
  }
}

// MulExpr ::= PrefixExpr {MulOper PrefixExpr}
// MulOper ::= * | /

public void mulExpr() throws IOException {
  prefixExpr();
  while (token.symbol() == Symbol.TIMES || token.symbol() == Symbol.DIV) {
    getToken();
    prefixExpr();
  }
}

// PrefixExpr ::= [AddOper] SimpleExpr {ListMethodCall}

public void prefixExpr() throws IOException {
  if (token.symbol() == Symbol.PLUS || token.symbol() == Symbol.MINUS) {
    getToken();
  }
  simpleExpr();
  while (token.symbol() == Symbol.LPAREN || token.symbol() == Symbol.PERIOD) {
    listMethodCall();
  }
}

//SimpleExpr ::= Literal | ( Expr ) | id [ ( [ListExpr {, ListExpr}] ) ] | scala . io . StdIn . readInt ( )
public void simpleExpr() throws IOException {
  switch (token.symbol()) {
    case INT:
    case BOOLEAN:
    case STRING:
      // Literal
      getToken();
      break;
    case LPAREN:
      // ( Expr )
      getToken();
      expr();
      if (token.symbol() != Symbol.RPAREN) {
        ErrorMessage . print (lexer . position (), "Expected ')'");
      }
      getToken();
      break;
    case ID:
      // id [ ( [ListExpr {, ListExpr}] ) ] 
      getToken();
      if (token.symbol() == Symbol.LBRACKET) {
        getToken();
        if (token.symbol() != Symbol.RBRACKET) {
          listExpr();
          while (token.symbol() == Symbol.COMMA) {
            getToken();
            listExpr();
          }
          if (token.symbol() != Symbol.RBRACKET) {
            ErrorMessage . print (lexer . position (), "Expected ']'");
          }
        }
        getToken();
      }
      break;
    case SCALA_PERIOD_IO_PERIOD_STDIN_PERIOD_READINT:
      // scala.io.StdIn.readInt()
      getToken();
      if (token.symbol() != Symbol.LPAREN) {
        ErrorMessage . print (lexer . position (), "Expected '('");
      }
      getToken();
      if (token.symbol() != Symbol.RPAREN) {
        ErrorMessage . print (lexer . position (), "Expected ')' )");
      }
      getToken();
      break;
    default:
        ErrorMessage . print (lexer . position (), "Expected simple expression)");
      break;
  }
}


// ListMethodCall ::= . head | . tail | . isEmpty
public void listMethodCall() throws IOException {
if (token.symbol() == Symbol.PERIOD) {
getToken();
if (token.symbol() == Symbol.HEAD) {
getToken();
} else if (token.symbol() == Symbol.TAIL) {
getToken();
} else if (token.symbol()== Symbol.ISEMPTY) {
getToken();
} else {
ErrorMessage . print (lexer . position (), "Expected head, tail, or isEmpty )");
}
} else {
ErrorMessage . print (lexer . position (), "Expected . for list method call )");
}
}

}
