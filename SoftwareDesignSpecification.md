<center>密级：公开</center> 

<center>编号：SE-EXP-DOC-2025-XX</center>



<center><b>文档名称：[概要设计说明书]</b></center>

<center><b>项目名称：[AI 代码审查与建议系统]</b></center>



| 编 制： | 吴芷铭【2330502151】、范乙丹【2220704131】 |
| :------ | :----------------------------------------: |
| 审 核： |                   郭雷勇                   |
| 批 准： |                   郭雷勇                   |

<center><b>广东药科大学 医药信息工程学院</b></center>	

<center><b>2025年10月08日</b></center>



版本信息：





## 1. **引言** 

### 1.1 编写目的

本设计文档旨在为"AI代码审查与建议系统"提供详细的技术设计方案，包括系统架构、模块结构、接口规范、数据结构和安全设计等。通过本文档，开发团队能够：

- 理解系统的整体架构和技术选型
- 明确各模块的功能划分和交互关系
- 按照统一的接口规范进行开发
- 建立可靠的数据存储和安全机制
- 为后续编码、测试和维护工作提供技术依据

### 1.2 项目背景

在计算机专业的学习与实践过程中，学生常常面临一个困境：编写的代码虽然能够运行，但其**质量、规范性、可维护性和安全性**却难以自我评估。传统的代码审查依赖于教师或同学的人工检查，效率低下且难以持续。

近年来，人工智能技术在自然语言处理和代码理解领域取得了显著进展，使得自动化、智能化的代码分析成为可能。与此同时，成熟的静态代码分析工具（如Pylint、Checkstyle）为自动化审查提供了可靠的基础。

因此，本项目旨在开发一个面向学生的**AI代码审查与建议系统**，将传统的静态分析工具与先进的AI模型相结合，为学生提供一个即时、易用、具有教育意义的代码质量反馈平台，帮助其培养良好的编程习惯，提升软件工程质量。

### 1.3 定义

- **AI 代码审查**：利用人工智能技术对源代码进行自动分析，识别潜在问题和改进点。
- **静态代码分析**：不执行程序代码，仅通过分析源代码的语法、结构、风格来发现问题的技术。
- **MVP（最小可行产品）**：指包含最核心功能、能够满足早期用户基本需求的初始产品版本。
- **代码质量指标**：衡量代码质量的一系列标准，通常包括可读性、可维护性、复杂度、安全性、规范性等。

### 1.4 参考资料

[1] Pressman, R. S., & Maxim, B. R. 《软件工程：实践者的研究方法》（原书第9版）. 机械工业出版社.
[2] 广东药科大学《软件工程》课程实验指导书与教学大纲.
[3] Martin, R. C. 《代码整洁之道》. 人民邮电出版社.
[4] SonarQube 官方文档. [Online] Available: https://docs.sonarqube.org/latest/
[5] Feng, Z., et al. "CodeBERT: A Pre-Trained Model for Programming and Natural Languages". arXiv preprint arXiv:2002.08155, 2020.

## 2. **总体设计**

### 2.1 **系统架构设计** (绘制系统架构图，阐述设计 rationale)



### 2.2 **模块结构设计 (Structure Chart)** (基于DFD进行变换设计，展示模块层次和调用关系)

#### 1. 系统顶层模块结构



#### 2. 代码审查模块详细结构



#### 3.用户管理模块结构



#### 4.数据访问模块结构



#### 5.服务层模块结构



#### 6.模块调用关系图



#### 7.控制流调用序列



#### 8.数据流转换图



### 2.3 **组件图 (Component Diagram)** (展示系统物理组件及其依赖)



## 3. **接口设计


### 3.1 外部接口设计

**1. 身份认证接口**

```
POST /api/auth/login
Content-Type: application/json
{
  "username": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "token": "jwt_token_string",
  "user_info": {...}
}
```

**2. 静态分析工具接口**

- **Pylint接口**：通过子进程调用pylint命令行工具
- **Checkstyle接口**：通过Java进程调用checkstyle.jar
- **统一接口规范**：返回标准化的JSON格式结果

**3. AI模型服务接口**

```
POST /api/ai/analyze
Authorization: Bearer {token}
Content-Type: application/json
{
  "code": "string",
  "language": "python|java",
  "analysis_type": "style|logic|security"
}

Response:
{
  "issues": [
    {
      "type": "error|warning|suggestion",
      "line": 10,
      "column": 5,
      "message": "描述信息",
      "suggestion": "改进建议",
      "confidence": 0.95
    }
  ],
  "overall_score": 85.5
}
```

### 3.2 内部接口设计 (模块间接口)

**1. 代码分析管理器接口**

```
class CodeAnalysisManager:
    def analyze_code(self, code_content: str, language: str) -> AnalysisResult:
        """协调静态分析和AI分析，返回整合结果"""
        pass
    
    def get_analysis_plugins(self) -> List[AnalysisPlugin]:
        """获取可用的分析插件"""
        pass
```



**2. 数据持久化接口**

```
class Repository:
    def save_analysis_result(self, user_id: str, result: AnalysisResult) -> str:
        """保存分析结果"""
        pass
    
    def get_user_history(self, user_id: str, limit: int = 10) -> List[AnalysisRecord]:
        """获取用户历史记录"""
        pass
```

### 3.3 **API 设计规范 (RESTful)** (提供OpenAPI/Swagger规范文档)

## 4. **数据结构设计**

### 4.1 **E-R 图 (Entity-Relationship Diagram)**



### 4.2 数据库逻辑设计 (将E-R图转换为关系模式)



### 4.3 数据库物理设计 (表结构、索引、视图)



## 5. **出错处理与安全设计**

### 5.1 错误处理机制

**1. 错误分类与编码**

python

```
class ErrorCode:
    # 系统错误 (1000-1999)
    SYSTEM_ERROR = 1000
    DATABASE_ERROR = 1001
    EXTERNAL_SERVICE_ERROR = 1002
    
    # 用户错误 (2000-2999)
    AUTHENTICATION_FAILED = 2001
    PERMISSION_DENIED = 2002
    INVALID_PARAMETER = 2003
    
    # 业务错误 (3000-3999)
    CODE_ANALYSIS_TIMEOUT = 3001
    UNSUPPORTED_LANGUAGE = 3002
    FILE_TOO_LARGE = 3003
```



**2. 统一错误响应格式**

json

```
{
  "success": false,
  "error_code": 2001,
  "error_message": "认证失败",
  "details": "具体的错误信息",
  "timestamp": "2025-01-20T10:30:00Z"
}
```



### 5.2 安全设计

**1. 身份认证与授权**

- 采用JWT令牌进行无状态认证
- 基于角色的访问控制(RBAC)
- 令牌有效期限制和自动续期机制

**2. 数据安全**

python

```
# 代码内容加密存储
def encrypt_code_content(code: str) -> str:
    """使用AES加密算法加密代码内容"""
    pass

# 敏感信息脱敏
def mask_sensitive_info(code: str) -> str:
    """脱敏密码、密钥等敏感信息"""
    pass
```



**3. 输入验证与防护**

python

```
class InputValidator:
    def validate_code_submission(self, code: str, language: str) -> bool:
        """验证代码提交的合法性"""
        # 检查代码长度
        if len(code) > 10 * 1024 * 1024:  # 10MB限制
            raise ValidationError("代码文件过大")
        
        # 检查语言支持
        if language not in SUPPORTED_LANGUAGES:
            raise ValidationError(f"不支持的语言: {language}")
        
        # 检查恶意代码模式
        if self.detect_malicious_patterns(code):
            raise SecurityError("检测到潜在的恶意代码")
        
        return True
```



**4. 审计日志**

```
class AuditLogger:
    def log_security_event(self, event_type: str, user_id: str, details: dict):
        """记录安全相关事件"""
        log_entry = {
            "timestamp": datetime.utcnow(),
            "event_type": event_type,
            "user_id": user_id,
            "ip_address": request.remote_addr,
            "user_agent": request.user_agent.string,
            "details": details
        }
        # 写入安全日志文件或数据库
```
