vector<int> twoSum(vector<int>& nums, int target) {
    // Hash map to store number -> index mapping
    unordered_map<int, int> map;
    
    // Iterate through the array
    for (int i = 0; i < nums.size(); i++) {
        // Calculate the complement we need
        int complement = target - nums[i];
        
        // Check if complement exists in map
        if (map.find(complement) != map.end()) {
            // Found the pair! Return both indices
            return {map[complement], i};
        }
        
        // Store current number and its index for future lookups
        map[nums[i]] = i;
    }
    
    // No solution found (shouldn't happen per problem constraints)
    return {};
}

