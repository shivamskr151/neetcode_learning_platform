// NeetCode 150 Problems Data Structure

export const categories = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    problems: [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        pattern: 'Hash Map',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        patternExplanation: `The key pattern here is using a Hash Map to store numbers we've seen along with their indices. Instead of checking every pair (O(n²)), we can:
1. Iterate through the array once
2. For each number, check if its complement (target - current number) exists in our map
3. If found, return both indices
4. Otherwise, store the current number and its index in the map

This reduces time complexity from O(n²) to O(n).`,
        patternExplanationHinglish: `Yahan main pattern hai Hash Map use karna jo numbers ko store kare with unke indices ke saath. Har pair ko check karne ki jagah (O(n²)), hum:
1. Array ko ek baar iterate karte hain
2. Har number ke liye, check karte hain ki uska complement (target - current number) map mein hai ya nahi
3. Agar mil gaya, toh dono indices return kar dete hain
4. Warna current number aur uska index map mein store kar dete hain

Isse time complexity O(n²) se O(n) ho jati hai.`,
        examples: [
          {
            input: { nums: [2, 7, 11, 15], target: 9 },
            output: [0, 1],
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
            explanationHinglish: 'Kyunki nums[0] + nums[1] == 9, isliye hum [0, 1] return karte hain.'
          },
          {
            input: { nums: [3, 2, 4], target: 6 },
            output: [1, 2],
            explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].',
            explanationHinglish: 'nums[1] + nums[2] == 6, isliye hum [1, 2] return karte hain.'
          },
          {
            input: { nums: [3, 3], target: 6 },
            output: [0, 1],
            explanation: 'Both elements are 3, so indices [0, 1] sum to 6.',
            explanationHinglish: 'Dono elements 3 hain, isliye indices [0, 1] ka sum 6 hai.'
          }
        ],
        solution: {
          javascript: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// Example execution:
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6));      // [1, 2]`,
          python: `def two_sum(nums, target):
    map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in map:
            return [map[complement], i]
        
        map[num] = i
    
    return []

# Example execution:
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]`,
          java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        
        map.put(nums[i], i);
    }
    
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        
        map[nums[i]] = i;
    }
    
    return {};
}`,
          go: `func twoSum(nums []int, target int) []int {
    numMap := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        
        if idx, exists := numMap[complement]; exists {
            return []int{idx, i}
        }
        
        numMap[num] = i
    }
    
    return []int{}
}`
        },
        complexity: {
          time: 'O(n) - Single pass through array',
          space: 'O(n) - Hash map stores at most n elements'
        }
      },
      {
        id: 2,
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        pattern: 'Hash Set',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        patternExplanation: `The pattern is using a Hash Set to track seen elements:
1. Iterate through the array
2. For each element, check if it's already in the set
3. If yes, we found a duplicate - return true
4. If no, add it to the set and continue
5. If we finish without finding duplicates, return false

This is more efficient than sorting (O(n log n)) or nested loops (O(n²)).`,
        examples: [
          {
            input: { nums: [1, 2, 3, 1] },
            output: true,
            explanation: '1 appears twice in the array.'
          },
          {
            input: { nums: [1, 2, 3, 4] },
            output: false,
            explanation: 'All elements are distinct.'
          },
          {
            input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] },
            output: true,
            explanation: 'Multiple duplicates exist (1, 2, 3, 4 all appear more than once).'
          }
        ],
        solution: {
          javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  
  for (const num of nums) {
    if (seen.has(num)) {
      return true;
    }
    seen.add(num);
  }
  
  return false;
}

// Example execution:
console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false`,
          python: `def contains_duplicate(nums):
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False

# Example execution:
print(contains_duplicate([1, 2, 3, 1]))  # True
print(contains_duplicate([1, 2, 3, 4]))  # False`,
          java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    
    return false;
}`,
          cpp: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    
    return false;
}`,
          go: `func containsDuplicate(nums []int) bool {
    seen := make(map[int]bool)
    
    for _, num := range nums {
        if seen[num] {
            return true
        }
        seen[num] = true
    }
    
    return false
}`
        },
        complexity: {
          time: 'O(n) - Single pass through array',
          space: 'O(n) - Set stores at most n elements'
        }
      },
      {
        id: 3,
        title: 'Valid Anagram',
        difficulty: 'Easy',
        pattern: 'Hash Map / Frequency Counter',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
        patternExplanation: `The pattern is using a frequency counter (Hash Map):
1. If strings have different lengths, they can't be anagrams
2. Count frequency of each character in first string
3. Decrement count for each character in second string
4. If all counts are zero, they're anagrams

Alternative: Sort both strings and compare (simpler but O(n log n)).`,
        examples: [
          {
            input: { s: 'anagram', t: 'nagaram' },
            output: true,
            explanation: 'Both strings contain the same characters with same frequencies.'
          },
          {
            input: { s: 'rat', t: 'car' },
            output: false,
            explanation: 'Different characters, so not anagrams.'
          }
        ],
        solution: {
          javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  
  const count = {};
  
  // Count characters in s
  for (const char of s) {
    count[char] = (count[char] || 0) + 1;
  }
  
  // Decrement for characters in t
  for (const char of t) {
    if (!count[char]) return false;
    count[char]--;
  }
  
  return true;
}

// Example execution:
console.log(isAnagram('anagram', 'nagaram')); // true
console.log(isAnagram('rat', 'car'));         // false`,
          python: `def is_anagram(s, t):
    if len(s) != len(t):
        return False
    
    count = {}
    
    # Count characters in s
    for char in s:
        count[char] = count.get(char, 0) + 1
    
    # Decrement for characters in t
    for char in t:
        if char not in count or count[char] == 0:
            return False
        count[char] -= 1
    
    return True

# Example execution:
print(is_anagram('anagram', 'nagaram'))  # True
print(is_anagram('rat', 'car'))          # False`,
          java: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    
    int[] count = new int[26];
    
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    
    for (int c : count) {
        if (c != 0) return false;
    }
    
    return true;
}`,
          cpp: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    
    int count[26] = {0};
    
    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    
    for (int c : count) {
        if (c != 0) return false;
    }
    
    return true;
}`,
          go: `func isAnagram(s string, t string) bool {
    if len(s) != len(t) {
        return false
    }
    
    count := make([]int, 26)
    
    for i := 0; i < len(s); i++ {
        count[s[i]-'a']++
        count[t[i]-'a']--
    }
    
    for _, c := range count {
        if c != 0 {
            return false
        }
    }
    
    return true
}`
        },
        complexity: {
          time: 'O(n) - Single pass through both strings',
          space: 'O(1) - Fixed size array (26 for lowercase letters) or O(k) for hash map where k is unique characters'
        }
      },
      {
        id: 4,
        title: 'Group Anagrams',
        difficulty: 'Medium',
        pattern: 'Hash Map + Sorting',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        patternExplanation: `Pattern: Use sorted string as key in hash map
1. For each string, sort its characters to create a canonical form
2. Use this sorted string as a key in a hash map
3. Group all strings with the same sorted key together
4. Return all groups

The key insight: Anagrams have the same sorted representation.`,
        examples: [
          {
            input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] },
            output: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
            explanation: 'Anagrams are grouped together.'
          },
          {
            input: { strs: [''] },
            output: [['']],
            explanation: 'Single empty string.'
          }
        ],
        solution: {
          javascript: `function groupAnagrams(strs) {
  const map = new Map();
  
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    
    if (!map.has(sorted)) {
      map.set(sorted, []);
    }
    map.get(sorted).push(str);
  }
  
  return Array.from(map.values());
}

// Example execution:
console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']));`,
          python: `def group_anagrams(strs):
    map = {}
    
    for s in strs:
        key = ''.join(sorted(s))
        if key not in map:
            map[key] = []
        map[key].append(s)
    
    return list(map.values())

# Example execution:
print(group_anagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))`,
          java: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = String.valueOf(chars);
        
        map.putIfAbsent(key, new ArrayList<>());
        map.get(key).add(s);
    }
    
    return new ArrayList<>(map.values());
}`,
          cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> map;
    
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        map[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& pair : map) {
        result.push_back(pair.second);
    }
    
    return result;
}`,
          go: `// Note: Add "sort" import at top: import "sort"
func groupAnagrams(strs []string) [][]string {
    map := make(map[string][]string)
    
    for _, s := range strs {
        key := []rune(s)
        sort.Slice(key, func(i, j int) bool {
            return key[i] < key[j]
        })
        keyStr := string(key)
        map[keyStr] = append(map[keyStr], s)
    }
    
    result := make([][]string, 0, len(map))
    for _, v := range map {
        result = append(result, v)
    }
    
    return result
}`
        },
        complexity: {
          time: 'O(n * k log k) - n strings, each sorted in k log k time',
          space: 'O(n * k) - Store all strings in map'
        }
      },
      {
        id: 5,
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        pattern: 'Hash Map + Bucket Sort / Heap',
        description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
        patternExplanation: `Pattern: Frequency counting + sorting/selection
1. Count frequency of each element using hash map
2. Option A: Sort by frequency and take top k (O(n log n))
3. Option B: Use bucket sort - create buckets by frequency (O(n))
4. Option C: Use max heap (O(n log k))

Bucket sort is most efficient for this problem.`,
        examples: [
          {
            input: { nums: [1, 1, 1, 2, 2, 3], k: 2 },
            output: [1, 2],
            explanation: '1 appears 3 times, 2 appears 2 times. Top 2 are [1, 2].'
          },
          {
            input: { nums: [1], k: 1 },
            output: [1],
            explanation: 'Only one element.'
          }
        ],
        solution: {
          javascript: `function topKFrequent(nums, k) {
  const freq = new Map();
  
  // Count frequencies
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  
  // Bucket sort by frequency
  const buckets = Array(nums.length + 1).fill(null).map(() => []);
  
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }
  
  // Collect top k
  const result = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  
  return result;
}

// Example execution:
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1, 2]`,
          python: `def top_k_frequent(nums, k):
    from collections import Counter
    
    freq = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    
    for num, count in freq.items():
        buckets[count].append(num)
    
    result = []
    for i in range(len(buckets) - 1, -1, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result

# Example execution:
print(top_k_frequent([1, 1, 1, 2, 2, 3], 2))  # [1, 2]`,
          java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }
    
    List<Integer>[] buckets = new List[nums.length + 1];
    for (int i = 0; i < buckets.length; i++) {
        buckets[i] = new ArrayList<>();
    }
    
    for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
        buckets[entry.getValue()].add(entry.getKey());
    }
    
    List<Integer> result = new ArrayList<>();
    for (int i = buckets.length - 1; i >= 0 && result.size() < k; i--) {
        result.addAll(buckets[i]);
    }
    
    return result.stream().mapToInt(i -> i).limit(k).toArray();
}`,
          cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int num : nums) {
        freq[num]++;
    }
    
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto& pair : freq) {
        buckets[pair.second].push_back(pair.first);
    }
    
    vector<int> result;
    for (int i = buckets.size() - 1; i >= 0 && result.size() < k; i--) {
        for (int num : buckets[i]) {
            result.push_back(num);
            if (result.size() == k) return result;
        }
    }
    
    return result;
}`,
          go: `func topKFrequent(nums []int, k int) []int {
    freq := make(map[int]int)
    for _, num := range nums {
        freq[num]++
    }
    
    buckets := make([][]int, len(nums)+1)
    for num, count := range freq {
        buckets[count] = append(buckets[count], num)
    }
    
    result := make([]int, 0, k)
    for i := len(buckets) - 1; i >= 0 && len(result) < k; i-- {
        for _, num := range buckets[i] {
            result = append(result, num)
            if len(result) == k {
                return result
            }
        }
    }
    
    return result
}`
        },
        complexity: {
          time: 'O(n) - Bucket sort approach',
          space: 'O(n) - Hash map and buckets'
        }
      },
      {
        id: 6,
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        pattern: 'Prefix/Suffix Product',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. You must write an algorithm that runs in O(n) time and without using the division operator.',
        patternExplanation: `Pattern: Two-pass approach with prefix and suffix products
1. First pass: Calculate left products (product of all elements to the left)
2. Second pass: Calculate right products and multiply with left products
3. Result[i] = left[i] * right[i]

Key insight: We can't use division, so we build products from both sides.`,
        examples: [
          {
            input: { nums: [1, 2, 3, 4] },
            output: [24, 12, 8, 6],
            explanation: 'For index 0: 2*3*4=24, for index 1: 1*3*4=12, etc.'
          },
          {
            input: { nums: [-1, 1, 0, -3, 3] },
            output: [0, 0, 9, 0, 0],
            explanation: 'Handles zeros correctly.'
          }
        ],
        solution: {
          javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  
  // Left pass: result[i] = product of all elements to the left
  let left = 1;
  for (let i = 0; i < n; i++) {
    result[i] = left;
    left *= nums[i];
  }
  
  // Right pass: multiply by product of all elements to the right
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= right;
    right *= nums[i];
  }
  
  return result;
}

// Example execution:
console.log(productExceptSelf([1, 2, 3, 4])); // [24, 12, 8, 6]`,
          python: `def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    
    # Left pass
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    
    # Right pass
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result

# Example execution:
print(product_except_self([1, 2, 3, 4]))  # [24, 12, 8, 6]`,
          java: `public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, 1);
    
    int left = 1;
    for (int i = 0; i < n; i++) {
        result[i] = left;
        left *= nums[i];
    }
    
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    
    return result;
}`,
          cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, 1);
    
    int left = 1;
    for (int i = 0; i < n; i++) {
        result[i] = left;
        left *= nums[i];
    }
    
    int right = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= right;
        right *= nums[i];
    }
    
    return result;
}`,
          go: `func productExceptSelf(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    for i := range result {
        result[i] = 1
    }
    
    left := 1
    for i := 0; i < n; i++ {
        result[i] = left
        left *= nums[i]
    }
    
    right := 1
    for i := n - 1; i >= 0; i-- {
        result[i] *= right
        right *= nums[i]
    }
    
    return result
}`
        },
        complexity: {
          time: 'O(n) - Two passes through array',
          space: 'O(1) - Excluding output array, only using constant space'
        }
      },
      {
        id: 7,
        title: 'Valid Sudoku',
        difficulty: 'Medium',
        pattern: 'Hash Set',
        description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the rules.',
        patternExplanation: `Pattern: Use sets to track seen values in rows, columns, and boxes
1. Create sets for each row, column, and 3x3 box
2. For each cell, check if value already exists in its row/column/box set
3. If found, invalid sudoku
4. Otherwise, add to all three sets

Key: Use string keys like "row-5-3" or box index calculation.`,
        examples: [
          {
            input: { board: [
              ['5','3','.','.','7','.','.','.','.'],
              ['6','.','.','1','9','5','.','.','.'],
              ['.','9','8','.','.','.','.','6','.'],
              ['8','.','.','.','6','.','.','.','3'],
              ['4','.','.','8','.','3','.','.','1'],
              ['7','.','.','.','2','.','.','.','6'],
              ['.','6','.','.','.','.','2','8','.'],
              ['.','.','.','4','1','9','.','.','5'],
              ['.','.','.','.','8','.','.','7','9']
            ]},
            output: true,
            explanation: 'Valid sudoku board.'
          }
        ],
        solution: {
          javascript: `function isValidSudoku(board) {
  const seen = new Set();
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const num = board[i][j];
      if (num === '.') continue;
      
      const rowKey = \`row-\${i}-\${num}\`;
      const colKey = \`col-\${j}-\${num}\`;
      const boxKey = \`box-\${Math.floor(i/3)}-\${Math.floor(j/3)}-\${num}\`;
      
      if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) {
        return false;
      }
      
      seen.add(rowKey);
      seen.add(colKey);
      seen.add(boxKey);
    }
  }
  
  return true;
}`,
          python: `def is_valid_sudoku(board):
    seen = set()
    
    for i in range(9):
        for j in range(9):
            num = board[i][j]
            if num == '.':
                continue
            
            row_key = f'row-{i}-{num}'
            col_key = f'col-{j}-{num}'
            box_key = f'box-{i//3}-{j//3}-{num}'
            
            if row_key in seen or col_key in seen or box_key in seen:
                return False
            
            seen.add(row_key)
            seen.add(col_key)
            seen.add(box_key)
    
    return True`,
          java: `public boolean isValidSudoku(char[][] board) {
    Set<String> seen = new HashSet<>();
    
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            char num = board[i][j];
            if (num == '.') continue;
            
            String rowKey = "row-" + i + "-" + num;
            String colKey = "col-" + j + "-" + num;
            String boxKey = "box-" + (i/3) + "-" + (j/3) + "-" + num;
            
            if (seen.contains(rowKey) || seen.contains(colKey) || seen.contains(boxKey)) {
                return false;
            }
            
            seen.add(rowKey);
            seen.add(colKey);
            seen.add(boxKey);
        }
    }
    
    return true;
}`,
          cpp: `bool isValidSudoku(vector<vector<char>>& board) {
    unordered_set<string> seen;
    
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            char num = board[i][j];
            if (num == '.') continue;
            
            string rowKey = "row-" + to_string(i) + "-" + num;
            string colKey = "col-" + to_string(j) + "-" + num;
            string boxKey = "box-" + to_string(i/3) + "-" + to_string(j/3) + "-" + num;
            
            if (seen.count(rowKey) || seen.count(colKey) || seen.count(boxKey)) {
                return false;
            }
            
            seen.insert(rowKey);
            seen.insert(colKey);
            seen.insert(boxKey);
        }
    }
    
    return true;
}`,
          go: `// Note: Add "fmt" import at top: import "fmt"
func isValidSudoku(board [][]byte) bool {
    seen := make(map[string]bool)
    
    for i := 0; i < 9; i++ {
        for j := 0; j < 9; j++ {
            num := board[i][j]
            if num == '.' {
                continue
            }
            
            rowKey := fmt.Sprintf("row-%d-%c", i, num)
            colKey := fmt.Sprintf("col-%d-%c", j, num)
            boxKey := fmt.Sprintf("box-%d-%d-%c", i/3, j/3, num)
            
            if seen[rowKey] || seen[colKey] || seen[boxKey] {
                return false
            }
            
            seen[rowKey] = true
            seen[colKey] = true
            seen[boxKey] = true
        }
    }
    
    return true
}`
        },
        complexity: {
          time: 'O(1) - Fixed 9x9 board, so constant time',
          space: 'O(1) - At most 81*3 entries in set'
        }
      },
      {
        id: 8,
        title: 'Longest Consecutive Sequence',
        difficulty: 'Hard',
        pattern: 'Hash Set',
        description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
        patternExplanation: `Pattern: Use set to find sequence starts
1. Add all numbers to a set for O(1) lookup
2. For each number, check if it's the start of a sequence (num-1 not in set)
3. If it's a start, count how long the sequence is
4. Track the maximum length

Key insight: Only check sequences starting from the smallest number in each sequence.`,
        examples: [
          {
            input: { nums: [100, 4, 200, 1, 3, 2] },
            output: 4,
            explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Its length is 4.'
          },
          {
            input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] },
            output: 9,
            explanation: 'Longest sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8].'
          }
        ],
        solution: {
          javascript: `function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let longest = 0;
  
  for (const num of numSet) {
    // Check if this is the start of a sequence
    if (!numSet.has(num - 1)) {
      let length = 1;
      let current = num + 1;
      
      // Count consecutive numbers
      while (numSet.has(current)) {
        length++;
        current++;
      }
      
      longest = Math.max(longest, length);
    }
  }
  
  return longest;
}

// Example execution:
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4`,
          python: `def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Check if this is the start of a sequence
        if num - 1 not in num_set:
            length = 1
            current = num + 1
            
            # Count consecutive numbers
            while current in num_set:
                length += 1
                current += 1
            
            longest = max(longest, length)
    
    return longest

# Example execution:
print(longest_consecutive([100, 4, 200, 1, 3, 2]))  # 4`,
          java: `public int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int num : nums) {
        numSet.add(num);
    }
    
    int longest = 0;
    for (int num : numSet) {
        if (!numSet.contains(num - 1)) {
            int length = 1;
            int current = num + 1;
            
            while (numSet.contains(current)) {
                length++;
                current++;
            }
            
            longest = Math.max(longest, length);
        }
    }
    
    return longest;
}`,
          cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int num : numSet) {
        if (numSet.find(num - 1) == numSet.end()) {
            int length = 1;
            int current = num + 1;
            
            while (numSet.find(current) != numSet.end()) {
                length++;
                current++;
            }
            
            longest = max(longest, length);
        }
    }
    
    return longest;
}`,
          go: `func longestConsecutive(nums []int) int {
    numSet := make(map[int]bool)
    for _, num := range nums {
        numSet[num] = true
    }
    
    longest := 0
    for num := range numSet {
        // Check if this is the start of a sequence
        if !numSet[num-1] {
            length := 1
            current := num + 1
            
            for numSet[current] {
                length++
                current++
            }
            
            if length > longest {
                longest = length
            }
        }
    }
    
    return longest
}`
        },
        complexity: {
          time: 'O(n) - Each number visited at most twice',
          space: 'O(n) - Set stores all numbers'
        }
      }
    ]
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    problems: [
      { id: 17, title: 'Valid Palindrome', difficulty: 'Easy', pattern: 'Two Pointers' },
      { id: 18, title: 'Two Sum II', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 19, title: '3Sum', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 20, title: 'Container With Most Water', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 21, title: 'Trapping Rain Water', difficulty: 'Hard', pattern: 'Two Pointers' }
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    problems: [
      { id: 22, title: 'Best Time to Buy & Sell Stock', difficulty: 'Easy', pattern: 'Sliding Window' },
      { id: 23, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 24, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 25, title: 'Permutation in String', difficulty: 'Medium', pattern: 'Sliding Window' },
      { id: 26, title: 'Minimum Window Substring', difficulty: 'Hard', pattern: 'Sliding Window' },
      { id: 27, title: 'Sliding Window Maximum', difficulty: 'Hard', pattern: 'Sliding Window + Deque' }
    ]
  },
  {
    id: 'stack',
    name: 'Stack',
    problems: [
      { id: 28, title: 'Valid Parentheses', difficulty: 'Easy', pattern: 'Stack' },
      { id: 29, title: 'Min Stack', difficulty: 'Medium', pattern: 'Stack' },
      { id: 30, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', pattern: 'Stack' },
      { id: 31, title: 'Generate Parentheses', difficulty: 'Medium', pattern: 'Backtracking + Stack' },
      { id: 32, title: 'Daily Temperatures', difficulty: 'Medium', pattern: 'Monotonic Stack' },
      { id: 33, title: 'Car Fleet', difficulty: 'Medium', pattern: 'Stack' }
    ]
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    problems: [
      { id: 34, title: 'Binary Search', difficulty: 'Easy', pattern: 'Binary Search' },
      { id: 35, title: 'Search 2D Matrix', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 36, title: 'Koko Eating Bananas', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 37, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 38, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 39, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', pattern: 'Binary Search' },
      { id: 40, title: 'Time Based Key Value Store', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 41, title: 'Find Peak Element', difficulty: 'Medium', pattern: 'Binary Search' },
      { id: 42, title: 'Search Sorted Array of Unknown Size', difficulty: 'Medium', pattern: 'Binary Search' }
    ]
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    problems: [
      { id: 43, title: 'Reverse Linked List', difficulty: 'Easy', pattern: 'Linked List' },
      { id: 44, title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Linked List' },
      { id: 45, title: 'Reorder List', difficulty: 'Medium', pattern: 'Linked List' },
      { id: 46, title: 'Remove Nth Node From End', difficulty: 'Medium', pattern: 'Two Pointers' },
      { id: 47, title: 'Copy List With Random Pointer', difficulty: 'Medium', pattern: 'Hash Map' },
      { id: 48, title: 'Add Two Numbers', difficulty: 'Medium', pattern: 'Linked List' },
      { id: 49, title: 'Linked List Cycle', difficulty: 'Easy', pattern: 'Floyd\'s Cycle Detection' },
      { id: 50, title: 'Find Intersection of Two Linked Lists', difficulty: 'Easy', pattern: 'Two Pointers' }
    ]
  },
  {
    id: 'trees',
    name: 'Trees',
    problems: [
      { id: 51, title: 'Invert Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 52, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 53, title: 'Diameter of Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 54, title: 'Balanced Binary Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 55, title: 'Same Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 56, title: 'Subtree of Another Tree', difficulty: 'Easy', pattern: 'Tree DFS' },
      { id: 57, title: 'Lowest Common Ancestor (BST)', difficulty: 'Medium', pattern: 'BST Properties' },
      { id: 58, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', pattern: 'BFS' },
      { id: 59, title: 'Binary Tree Right Side View', difficulty: 'Medium', pattern: 'BFS' },
      { id: 60, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', pattern: 'Tree DFS' },
      { id: 61, title: 'Validate BST', difficulty: 'Medium', pattern: 'BST Properties' },
      { id: 62, title: 'Kth Smallest in BST', difficulty: 'Medium', pattern: 'Inorder Traversal' },
      { id: 63, title: 'Construct Binary Tree from Pre/Post', difficulty: 'Medium', pattern: 'Tree Construction' },
      { id: 64, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', pattern: 'Tree Serialization' }
    ]
  },
  {
    id: 'tries',
    name: 'Tries',
    problems: [
      { id: 65, title: 'Implement Trie', difficulty: 'Medium', pattern: 'Trie' },
      { id: 66, title: 'Design Add and Search Word', difficulty: 'Medium', pattern: 'Trie + DFS' },
      { id: 67, title: 'Word Search II', difficulty: 'Hard', pattern: 'Trie + Backtracking' },
      { id: 68, title: 'Longest Word in Dictionary', difficulty: 'Medium', pattern: 'Trie' }
    ]
  },
  {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    problems: [
      { id: 69, title: 'Kth Largest Element in Array', difficulty: 'Medium', pattern: 'Heap' },
      { id: 70, title: 'Last Stone Weight', difficulty: 'Easy', pattern: 'Heap' },
      { id: 71, title: 'K Closest Points to Origin', difficulty: 'Medium', pattern: 'Heap' },
      { id: 72, title: 'Task Scheduler', difficulty: 'Medium', pattern: 'Heap + Greedy' },
      { id: 73, title: 'Design Twitter', difficulty: 'Medium', pattern: 'Heap' },
      { id: 74, title: 'Find Median from Data Stream', difficulty: 'Hard', pattern: 'Two Heaps' }
    ]
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    problems: [
      { id: 75, title: 'Subsets', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 76, title: 'Combination Sum', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 77, title: 'Permutations', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 78, title: 'Combination Sum II', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 79, title: 'Word Search', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 80, title: 'Palindrome Partitioning', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 81, title: 'Letter Combinations of Phone Number', difficulty: 'Medium', pattern: 'Backtracking' },
      { id: 82, title: 'N Queens', difficulty: 'Hard', pattern: 'Backtracking' }
    ]
  },
  {
    id: 'graphs',
    name: 'Graphs',
    problems: [
      { id: 83, title: 'Number of Islands', difficulty: 'Medium', pattern: 'DFS/BFS' },
      { id: 84, title: 'Max Area of Island', difficulty: 'Medium', pattern: 'DFS' },
      { id: 85, title: 'Clone Graph', difficulty: 'Medium', pattern: 'DFS/BFS' },
      { id: 86, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', pattern: 'DFS' },
      { id: 87, title: 'Surrounded Regions', difficulty: 'Medium', pattern: 'DFS' },
      { id: 88, title: 'Rotting Oranges', difficulty: 'Medium', pattern: 'BFS' },
      { id: 89, title: 'Walls and Gates', difficulty: 'Medium', pattern: 'BFS' },
      { id: 90, title: 'Course Schedule', difficulty: 'Medium', pattern: 'Topological Sort' },
      { id: 91, title: 'Course Schedule II', difficulty: 'Medium', pattern: 'Topological Sort' },
      { id: 92, title: 'Redundant Connection', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 93, title: 'Number of Connected Components', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 94, title: 'Graph Valid Tree', difficulty: 'Medium', pattern: 'Union Find' },
      { id: 95, title: 'Word Ladder', difficulty: 'Hard', pattern: 'BFS' },
      { id: 96, title: 'Minimum Knight Moves', difficulty: 'Medium', pattern: 'BFS' },
      { id: 97, title: 'Evaluate Division', difficulty: 'Medium', pattern: 'DFS' },
      { id: 98, title: 'Alien Dictionary', difficulty: 'Hard', pattern: 'Topological Sort' }
    ]
  },
  {
    id: 'advanced-graphs',
    name: 'Advanced Graphs',
    problems: [
      { id: 99, title: 'Network Delay Time', difficulty: 'Medium', pattern: 'Dijkstra' },
      { id: 100, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', pattern: 'Bellman-Ford' },
      { id: 101, title: 'Swim in Rising Water', difficulty: 'Hard', pattern: 'Dijkstra' },
      { id: 102, title: 'Min Cost to Connect All Points', difficulty: 'Medium', pattern: 'Prim\'s / Kruskal' },
      { id: 103, title: 'Max Points on a Line', difficulty: 'Hard', pattern: 'Math' },
      { id: 104, title: 'Bipartite Graph', difficulty: 'Medium', pattern: 'Graph Coloring' }
    ]
  },
  {
    id: 'dp-1d',
    name: 'Dynamic Programming 1D',
    problems: [
      { id: 105, title: 'Climbing Stairs', difficulty: 'Easy', pattern: 'DP' },
      { id: 106, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', pattern: 'DP' },
      { id: 107, title: 'House Robber', difficulty: 'Medium', pattern: 'DP' },
      { id: 108, title: 'House Robber II', difficulty: 'Medium', pattern: 'DP' },
      { id: 109, title: 'Longest Palindromic Substring', difficulty: 'Medium', pattern: 'DP' },
      { id: 110, title: 'Palindromic Substrings', difficulty: 'Medium', pattern: 'DP' },
      { id: 111, title: 'Decode Ways', difficulty: 'Medium', pattern: 'DP' },
      { id: 112, title: 'Coin Change', difficulty: 'Medium', pattern: 'DP' },
      { id: 113, title: 'Maximum Product Subarray', difficulty: 'Medium', pattern: 'DP' },
      { id: 114, title: 'Word Break', difficulty: 'Medium', pattern: 'DP' }
    ]
  },
  {
    id: 'dp-2d',
    name: 'Dynamic Programming 2D',
    problems: [
      { id: 115, title: 'Unique Paths', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 116, title: 'Longest Common Subsequence', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 117, title: 'Longest Increasing Path Matrix', difficulty: 'Hard', pattern: 'DP 2D + DFS' },
      { id: 118, title: 'Coin Change II', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 119, title: 'Target Sum', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 120, title: 'Interleaving String', difficulty: 'Medium', pattern: 'DP 2D' },
      { id: 121, title: 'Edit Distance', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 122, title: 'Burst Balloons', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 123, title: 'Regular Expression Matching', difficulty: 'Hard', pattern: 'DP 2D' },
      { id: 124, title: 'Maximum Profit in Job Scheduling', difficulty: 'Hard', pattern: 'DP 2D' }
    ]
  },
  {
    id: 'greedy',
    name: 'Greedy',
    problems: [
      { id: 125, title: 'Maximum Subarray', difficulty: 'Medium', pattern: 'Kadane\'s Algorithm' },
      { id: 126, title: 'Jump Game', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 127, title: 'Jump Game II', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 128, title: 'Gas Station', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 129, title: 'Hand of Straights', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 130, title: 'Merge Triplets', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 131, title: 'Partition Labels', difficulty: 'Medium', pattern: 'Greedy' }
    ]
  },
  {
    id: 'intervals',
    name: 'Intervals',
    problems: [
      { id: 132, title: 'Insert Interval', difficulty: 'Medium', pattern: 'Intervals' },
      { id: 133, title: 'Merge Intervals', difficulty: 'Medium', pattern: 'Intervals' },
      { id: 134, title: 'Non-overlapping Intervals', difficulty: 'Medium', pattern: 'Greedy' },
      { id: 135, title: 'Meeting Rooms', difficulty: 'Easy', pattern: 'Intervals' },
      { id: 136, title: 'Meeting Rooms II', difficulty: 'Medium', pattern: 'Heap' },
      { id: 137, title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', pattern: 'Intervals + Heap' }
    ]
  },
  {
    id: 'math-bit-manipulation',
    name: 'Math & Bit Manipulation',
    problems: [
      { id: 138, title: 'Sum of Two Integers', difficulty: 'Medium', pattern: 'Bit Manipulation' },
      { id: 139, title: 'Reverse Bits', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 140, title: 'Number of 1 Bits', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 141, title: 'Counting Bits', difficulty: 'Easy', pattern: 'DP + Bit Manipulation' },
      { id: 142, title: 'Power of Two', difficulty: 'Easy', pattern: 'Bit Manipulation' },
      { id: 143, title: 'Missing Number', difficulty: 'Easy', pattern: 'Math / XOR' },
      { id: 144, title: 'Rotate Image', difficulty: 'Medium', pattern: 'Matrix Manipulation' },
      { id: 145, title: 'Pascals Triangle', difficulty: 'Easy', pattern: 'Math' },
      { id: 146, title: 'Valid Tic Tac Toe State', difficulty: 'Medium', pattern: 'Simulation' },
      { id: 147, title: 'Multiply Strings', difficulty: 'Medium', pattern: 'String Math' },
      { id: 148, title: 'Happy Number', difficulty: 'Easy', pattern: 'Hash Set / Floyd\'s Cycle' },
      { id: 149, title: 'Factorial Trailing Zeroes', difficulty: 'Medium', pattern: 'Math' },
      { id: 150, title: 'Excel Sheet Column Number', difficulty: 'Easy', pattern: 'Base Conversion' }
    ]
  }
];

// Helper function to get all problems
export const getAllProblems = () => {
  return categories.flatMap(category => 
    category.problems.map(problem => ({
      ...problem,
      categoryId: category.id,
      categoryName: category.name
    }))
  );
};

// Helper function to get problem by id
export const getProblemById = (id) => {
  for (const category of categories) {
    const problem = category.problems.find(p => p.id === id);
    if (problem) {
      return { ...problem, categoryId: category.id, categoryName: category.name };
    }
  }
  return null;
};

// Helper function to get category by id
export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

