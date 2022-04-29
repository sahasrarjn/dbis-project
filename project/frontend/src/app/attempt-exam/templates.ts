export var templates = {
    "media/templates/3.cpp": `
        #include <bits/stdc++.h>

        using namespace std;

        template<typename A, typename B> ostream& operator<<(ostream &os, const pair<A, B> &p) { return os << '(' << p.first << ", " << p.second << ')'; }
        template<typename T_container, typename T = typename enable_if<!is_same<T_container, string>::value, typename T_container::value_type>::type> ostream& operator<<(ostream &os, const T_container &v) { os << '{'; string sep; for (const T &x : v) os << sep << x, sep = ", "; return os << '}'; }
        void dbg_out() { cerr << endl; }
        template<typename Head, typename... Tail> void dbg_out(Head H, Tail... T) { cerr << ' ' << H; dbg_out(T...); }
        #ifdef LOCAL
        #define dbg(...) cerr << "(" << #__VA_ARGS__ << "):", dbg_out(__VA_ARGS__)
        #else
        #define dbg(...)
        #endif

        #define ar array
        #define ll long long
        #define ld long double
        #define sza(x) ((int)x.size())
        #define all(a) (a).begin(), (a).end()

        const int MAX_N = 1e5 + 5;
        const ll MOD = 1e9 + 7;
        const ll INF = 1e9;
        const ld EPS = 1e-9;



        void solve() {
            
        }

        int main() {
            ios_base::sync_with_stdio(0);
            cin.tie(0); cout.tie(0);
            int tc = 1;
            // cin >> tc;
            for (int t = 1; t <= tc; t++) {
                // cout << "Case #" << t << ": ";
                solve();
            }
        }`,

    "media/templates/2.cpp": `
        #include <bits/stdc++.h>
        using namespace std;

        int main()
        {

        }
    `,

    "media/templates/1.py": `#!/usr/bin/env python
        import sys,os
        import time
        import argparse
        
        import matplotlib as mpl
        mpl.use('Agg')
        import matplotlib.pyplot as plt
        
        import numpy as np
        import networkx as nx
        
        def doArgs(argList, name):
            parser = argparse.ArgumentParser(description=name)
        
            parser.add_argument('-v', "--verbose", action="store_true", help="Enable verbose debugging", default=False)
            parser.add_argument('--input', action="store", dest="inputFn", type=str, help="Input file name", required=True)
            parser.add_argument('--output', action="store", dest="outputFn", type=str, help="Output file name", required=True)
        
            return parser.parse_args(argList)
        
        def main():
            progName = "Template"
            args = doArgs(sys.argv[1:], progName)
        
            verbose = args.verbose
            inputFn = args.inputFn
            outputFn = args.outputFn
        
            print "Starting %s" % (progName)
            startTime = float(time.time())
        
            if not os.path.isfile(inputFn):
                print "Input doesn't exist, exiting"
                return
        
            outputBase = os.path.dirname(outputFn)
            if outputBase!='' and not os.path.exists(outputBase):
                print "Output directory doesn't exist, making output dirs: %s" % (outputBase)
                os.makedirs(outputBase)
        
        
            print "Finished in %0.4f seconds" % (time.time() - startTime)
            return
        
        if __name__ == '__main__':
            #sys.argv = ["programName.py","--input","test.txt","--output","tmp/test.txt"]
            main()`,

    "media/templates/0.py": ``
}