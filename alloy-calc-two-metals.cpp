#include <bits/stdc++.h>
using namespace std;

int main() {
    // ===== VALUES =====
    int X = 25;  // units of metal X
    int Y = 75;  // units of metal Y

    // Ratios ranges for metals X and Y
    double x_min = 0.20, x_max = 0.30; // for metal X
    double y_min = 0.70, y_max = 0.80; // for metal Y

    // ===== CASE 0: all units =====
    double ratio = double(X) / (X + Y);
    if (ratio >= x_min && ratio <= x_max) {
        cout << "Maximum alloy units possible: " << X + Y << endl;
        return 0;
    }

    // ===== CASE 1: ratio x:Y =====
    int k1 = min(X / x_min, Y / y_max);
    int T1 = (x_min + y_max) * k1;

    // ===== CASE 2: ratio X:y =====
    int k2 = min(X / x_max, Y / y_min);
    int T2 = (x_max + y_min) * k2;

    // ===== RESULT =====
    int result = max(T1, T2);

    cout << "Maximum alloy units possible: " << result << endl;

    return 0;
}