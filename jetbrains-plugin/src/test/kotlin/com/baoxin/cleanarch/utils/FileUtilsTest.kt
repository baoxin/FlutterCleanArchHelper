package com.baoxin.cleanarch.utils

import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/**
 * FileUtils 测试类
 */
class FileUtilsTest {
    
    @Test
    fun testNormalizeFeatureName() {
        // 测试正常情况
        assertEquals("user_profile", FileUtils.normalizeFeatureName("User Profile"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("user-profile"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("user.profile"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("user@profile"))
        
        // 测试边界情况
        assertEquals("user", FileUtils.normalizeFeatureName("_user_"))
        assertEquals("user_123", FileUtils.normalizeFeatureName("user123"))
        assertEquals("", FileUtils.normalizeFeatureName("@#$%"))
        assertEquals("", FileUtils.normalizeFeatureName(""))
        
        // 测试多个连续特殊字符
        assertEquals("user_profile", FileUtils.normalizeFeatureName("user---profile"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("user___profile"))
        assertEquals("user_profile_page", FileUtils.normalizeFeatureName("user...profile...page"))
    }
    
    @Test
    fun testNormalizeFeatureNameCaseInsensitive() {
        assertEquals("user_profile", FileUtils.normalizeFeatureName("USER_PROFILE"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("User_Profile"))
        assertEquals("user_profile", FileUtils.normalizeFeatureName("uSeR_pRoFiLe"))
    }
    
    @Test
    fun testNormalizeFeatureNameWithNumbers() {
        assertEquals("user_profile_v2", FileUtils.normalizeFeatureName("User Profile V2"))
        assertEquals("api_v1_0", FileUtils.normalizeFeatureName("API v1.0"))
        assertEquals("test_123_feature", FileUtils.normalizeFeatureName("test-123-feature"))
    }
}
