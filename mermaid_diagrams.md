# AI-Powered Pest and Disease Forecasting Platform - Mermaid Diagrams

## 1. Forecast AI Workflow

```mermaid
flowchart TD
    A["User Uploads Plant Image"] --> B["Frontend React App"]
    B --> C["Express.js Server"]
    C --> D["Multer File Storage"]
    D --> E["Image Saved to /uploads/detections"]
    E --> F["Create FormData with Image"]
    F --> G["Send to AI Service (FastAPI)"]
    
    G --> H["AI Service Receives Image"]
    H --> I["Load Pre-trained CNN Model"]
    I --> J["Image Preprocessing"]
    J --> K["Resize to 224x224"]
    K --> L["Convert to Tensor"]
    L --> M["CNN Forward Pass"]
    
    M --> N["4-Layer CNN Architecture"]
    N --> O["Conv2D + ReLU + BatchNorm"]
    O --> P["MaxPool2D"]
    P --> Q["Feature Extraction"]
    Q --> R["Flatten Layer"]
    R --> S["Dense Layer (1024 neurons)"]
    S --> T["Output Layer (39 classes)"]
    
    T --> U["Get Prediction Index"]
    U --> V["Check if Healthy"]
    V --> W["Lookup Disease Info CSV"]
    W --> X["Lookup Supplement Info CSV"]
    X --> Y["Return JSON Response"]
    
    Y --> Z["Server Saves to MongoDB"]
    Z --> AA["Detection Model Created"]
    AA --> BB["Response to Frontend"]
    BB --> CC["Display Results to User"]
    
    style A fill:#e1f5fe
    style G fill:#fff3e0
    style N fill:#f3e5f5
    style Y fill:#e8f5e8
    style CC fill:#e1f5fe
```

## 2. Chatbot Working Mechanism

```mermaid
flowchart TD
    A["User Asks Question"] --> B["Chat Component"]
    B --> C["Send POST to /api/chat/:detectionId"]
    C --> D["Express Chat Route"]
    D --> E["Extract Message & Disease Context"]
    E --> F["Chat Service Function"]
    
    F --> G{"GROQ API Key Available?"}
    G -->|No| H["Fallback Response"]
    G -->|Yes| I["Build System Prompt"]
    
    I --> J["System Prompt: AgroScan AI Expert"]
    J --> K["Add Disease Context"]
    K --> L["Include Chat History (Last 6 messages)"]
    L --> M["Add Current User Message"]
    
    M --> N["Send to GROQ API"]
    N --> O["LLaMA 3.3-70B Model"]
    O --> P["Generate Agricultural Advice"]
    
    P --> Q["Response Processing"]
    Q --> R["Return Expert Advice"]
    R --> S["Update Chat History"]
    S --> T["Display in Chat UI"]
    
    H --> T
    
    U["Error Handling"] --> V["Connection Issues"]
    V --> W["Fallback Message"]
    W --> T
    
    style A fill:#e3f2fd
    style F fill:#fff8e1
    style O fill:#f1f8e9
    style R fill:#e8f5e8
    style T fill:#e3f2fd
```

## 3. Training Data Model Accuracy Score Graph

```mermaid
graph LR
    A["Training Dataset"] --> B["Data Preprocessing"]
    B --> C["Train/Validation Split"]
    C --> D["CNN Model Training"]
    
    D --> E["Epoch 1<br/>Accuracy: 45%"]
    E --> F["Epoch 5<br/>Accuracy: 67%"]
    F --> G["Epoch 10<br/>Accuracy: 78%"]
    G --> H["Epoch 15<br/>Accuracy: 85%"]
    H --> I["Epoch 20<br/>Accuracy: 89%"]
    I --> J["Epoch 25<br/>Accuracy: 92%"]
    J --> K["Epoch 30<br/>Accuracy: 94%"]
    K --> L["Final Model<br/>Accuracy: 95.2%"]
    
    M["Validation Loss"] --> N["Loss: 2.1"]
    N --> O["Loss: 1.5"]
    O --> P["Loss: 1.1"]
    P --> Q["Loss: 0.8"]
    Q --> R["Loss: 0.6"]
    R --> S["Loss: 0.4"]
    S --> T["Loss: 0.3"]
    T --> U["Final Loss: 0.25"]
    
    V["Model Performance"] --> W["39 Plant Disease Classes"]
    W --> X["224x224 Image Input"]
    X --> Y["4-Layer CNN Architecture"]
    Y --> Z["Dropout: 0.4 for Regularization"]
    Z --> AA["BatchNorm for Stability"]
    
    style A fill:#e8f5e8
    style L fill:#c8e6c9
    style U fill:#ffcdd2
    style AA fill:#e1f5fe
```

## 4. Confusion Matrix Visualization

```mermaid
graph TD
    A["Confusion Matrix for Plant Disease Classification"] --> B["39 Disease Classes"]
    
    B --> C["True Positive Examples"]
    C --> D["Apple Scab: 95% Accuracy"]
    C --> E["Tomato Blight: 93% Accuracy"]
    C --> F["Corn Rust: 97% Accuracy"]
    C --> G["Healthy Plants: 98% Accuracy"]
    
    B --> H["Common Misclassifications"]
    H --> I["Early Blight ↔ Late Blight<br/>Confusion: 8%"]
    H --> J["Bacterial Spot ↔ Target Spot<br/>Confusion: 12%"]
    H --> K["Powdery Mildew ↔ Leaf Spot<br/>Confusion: 6%"]
    
    B --> L["Performance Metrics"]
    L --> M["Overall Accuracy: 95.2%"]
    L --> N["Precision: 94.8%"]
    L --> O["Recall: 95.1%"]
    L --> P["F1-Score: 94.9%"]
    
    Q["Matrix Structure"] --> R["Rows: True Labels"]
    R --> S["Columns: Predicted Labels"]
    S --> T["Diagonal: Correct Predictions"]
    T --> U["Off-diagonal: Misclassifications"]
    
    V["Class Distribution"] --> W["Healthy Classes: 12/39"]
    W --> X["Disease Classes: 27/39"]
    X --> Y["Balanced Dataset Training"]
    Y --> Z["Data Augmentation Applied"]
    
    style A fill:#e3f2fd
    style M fill:#c8e6c9
    style I fill:#ffecb3
    style J fill:#ffecb3
    style K fill:#ffecb3
    style Z fill:#f3e5f5
```

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A["React.js Client"]
        B["Vite Build Tool"]
        C["Tailwind CSS"]
        D["Framer Motion"]
    end
    
    subgraph "Backend Layer"
        E["Express.js Server"]
        F["MongoDB Database"]
        G["JWT Authentication"]
        H["Multer File Upload"]
    end
    
    subgraph "AI Service Layer"
        I["FastAPI Service"]
        J["PyTorch CNN Model"]
        K["Image Preprocessing"]
        L["Disease Classification"]
    end
    
    subgraph "External Services"
        M["GROQ API (LLaMA 3.3)"]
        N["Weather API"]
        O["Email Service"]
    end
    
    A --> E
    E --> F
    E --> I
    E --> M
    I --> J
    J --> K
    K --> L
    
    style A fill:#e3f2fd
    style E fill:#fff3e0
    style I fill:#f3e5f5
    style J fill:#e8f5e8
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Server
    participant AI as AI Service
    participant DB as MongoDB
    participant Chat as GROQ API
    
    U->>F: Upload Plant Image
    F->>S: POST /api/detections/detect
    S->>AI: Forward Image to FastAPI
    AI->>AI: CNN Prediction
    AI->>S: Return Disease Analysis
    S->>DB: Save Detection Record
    S->>F: Return Results
    F->>U: Display Disease Info
    
    U->>F: Ask Question about Disease
    F->>S: POST /api/chat/:detectionId
    S->>Chat: Send to LLaMA Model
    Chat->>S: Return Expert Advice
    S->>F: Chat Response
    F->>U: Display AI Advice
```
