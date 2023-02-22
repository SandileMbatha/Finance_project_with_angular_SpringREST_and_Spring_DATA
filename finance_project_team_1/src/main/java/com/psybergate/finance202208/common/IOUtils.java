package com.psybergate.finance202208.common;

@SuppressWarnings("unused")
public class IOUtils {

  public enum ConsoleColor {
    DEFAULT("\u001B[0m"), RED("\u001B[31m"), GREEN("\u001B[32m"), BLUE("\u001B[34m");

    private final String colorCode;

    ConsoleColor(String colorCode) {
      this.colorCode = colorCode;
    }

    @Override
    public String toString() {
      return colorCode;
    }
  }

  public static void printGreen(String message) {
    System.out.println(ConsoleColor.GREEN + message + ConsoleColor.DEFAULT);
  }

  public static void printBlue(String message) {
    System.out.println(ConsoleColor.BLUE + message + ConsoleColor.DEFAULT);
  }

  public static void printRed(String message) {
    System.out.println(ConsoleColor.RED + message + ConsoleColor.DEFAULT);
  }
}
