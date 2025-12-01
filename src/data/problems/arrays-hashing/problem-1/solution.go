package main

func twoSum(nums []int, target int) []int {
    numMap := make(map[int]int)
    
    for i, num := range nums {
        complement := target - num
        
        if idx, exists := numMap[complement]; exists {
            return []int{idx, i}
        }
        
        numMap[num] = i
    }
    
    return []int{}
}

// Example execution:
// func main() {
//     result1 := twoSum([]int{2, 7, 11, 15}, 9)
//     fmt.Println(result1) // [0, 1]
//     
//     result2 := twoSum([]int{3, 2, 4}, 6)
//     fmt.Println(result2) // [1, 2]
// }

