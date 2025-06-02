#include <iostream>
using namespace std;

int bool isPrime(int number) {
    if (number <= 1) return false;
    if (number == 2) return true;
    if (number % 2 == 0) return false; 

    for (int i = 3; i * i <= number; i += 2) {
        if (number % i == 0)
            return false;
    }
    return true;
}

int main() {
    int n;
    cout << "정수를 입력하세요: ";
    cin >> n;

    if (isPrime(n))
        cout << n << "은(는) 소수입니다." << endl;
    else
        cout << n << "은(는) 소수가 아닙니다." << endl;

    return 0;
}
