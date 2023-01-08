#include <stdio.h>
#include <math.h>

int main(){
	float x, y, Fx;
	printf ("Nhap vao 2 so x, y: ");
	scanf ("%f %f", &x, &y);
	if (x < 5){
        printf("ok1");
        Fx = (float)(3 - 5 * x * y * y);
    }
	if (5 <= x && x < 13.5){
        printf("ok2");
        Fx = (float)(4 * x * x * x - 7);
    }
	if (13.5<=x &&  x<18){
        printf("ok3");
		Fx=(float)(sin(x)*sin(x)+5);
    }
    if(x>=18){
        printf("ok4");
        Fx = (float)(2 * x + 3 * y);
    }
		printf("Gia tri cua bieu thuc la: %f", Fx);
	

	return 0;

}