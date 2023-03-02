// PL0Syn.java

// This program is a recursive descent parser for PL/0.

public class PL0Syn {

  public static void main (String args []) throws java.io.IOException {

    System . out . println ("Source Program");
    System . out . println ("--------------");
    System . out . println ();

    SyntaxAnalyzer pl0 = new SyntaxAnalyzer ();
    pl0 . program ();

    System . out . println ();
    System . out . println ();
    System . out . println ("PARSE SUCCESSFUL");
  }

}
