#include <bits/stdc++.h>
using namespace std;

struct Ratio {
    long long num;
    long long den;
};

long long ceil_div(long long a, long long b) {
    return (a + b - 1) / b;
}

long long floor_div(long long a, long long b) {
    return a / b;
}

bool feasible(
    long long T,
    const vector<long long>& A,
    const vector<Ratio>& rmin,
    const vector<Ratio>& rmax
) {
    long long sumLow = 0, sumHigh = 0;
    int n = A.size();

    for (int i = 0; i < n; i++) {
        long long low = ceil_div(rmin[i].num * T, rmin[i].den);
        long long high = floor_div(rmax[i].num * T, rmax[i].den);

        low = max(low, 0LL);
        high = min(high, A[i]);

        if (low > high) return false;

        sumLow += low;
        sumHigh += high;
    }
    return sumLow <= T && T <= sumHigh;
}

long long maxAlloy(
    const vector<long long>& A,
    const vector<Ratio>& rmin,
    const vector<Ratio>& rmax
) {
    long long lo = 0;
    long long hi = accumulate(A.begin(), A.end(), 0LL);
    long long best = 0;

    while (lo <= hi) {
        long long mid = (lo + hi) / 2;
        if (feasible(mid, A, rmin, rmax)) {
            best = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return best;
}

vector<long long> recoverSolution(
    long long T,
    const vector<long long>& A,
    const vector<Ratio>& rmin,
    const vector<Ratio>& rmax
) {
    int n = A.size();
    vector<long long> low(n), high(n), x(n);

    long long sumLow = 0;
    for (int i = 0; i < n; i++) {
        low[i] = ceil_div(rmin[i].num * T, rmin[i].den);
        high[i] = floor_div(rmax[i].num * T, rmax[i].den);

        low[i] = max(low[i], 0LL);
        high[i] = min(high[i], A[i]);

        x[i] = low[i];
        sumLow += low[i];
    }

    long long remaining = T - sumLow;

    for (int i = 0; i < n && remaining > 0; i++) {
        long long add = min(remaining, high[i] - low[i]);
        x[i] += add;
        remaining -= add;
    }

    return x;
}

int main() {
    // Example: 2 metals
    vector<long long> A = {22, 78};

    vector<Ratio> rmin = {
      {
        {88, 100}, // Tin Bronze
        {8, 100}
      },
      {
        {5, 10},   // Bismuth Bronze
        {2, 10},
        {1, 10}
      },
      {
        {68, 100}, // Black Bronze
        {8, 100},
        {8, 100}
      }
    };

    vector<Ratio> rmax = {
      {
        {92, 100}, // Tin Bronze
        {12, 100}
      },
      {
        {7, 10},   // Bismuth Bronze
        {3, 10},
        {2, 10}
      },
      {
        {84, 100}, // Black Bronze
        {16, 100},
        {16, 100}
      }
    };

    long long T = maxAlloy(A, rmin[0], rmax[0]);
    vector<long long> x = recoverSolution(T, A, rmin[0], rmax[0]);

    cout << "Total alloy units: " << T << "\n";
    for (int i = 0; i < x.size(); i++) {
        cout << "Metal " << i << ": " << x[i] << "\n";
    }
}
