#include <stdio.h>

int main() {
  printf("Five in number is %d", five());
  if (five() != 5) {
     printf("Failed");
  }
  else {
     printf("Success");
  }
  return 0;
} 