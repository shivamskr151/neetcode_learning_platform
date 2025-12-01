def two_sum(nums, target):
    map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in map:
            return [map[complement], i]
        
        map[num] = i
    
    return []

# Example execution:
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]

