"""
Confusion Matrix Analysis for Plant Disease Classification Model
==============================================================

This script shows how to generate confusion matrix analysis for your 39-class
plant disease classification model. Since no actual test data was found in 
the project, this provides the framework to analyze real evaluation results.

Classes: 39 plant disease categories (from CNN.py idx_to_classes)
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
from sklearn.metrics import precision_recall_fscore_support
import torch
import torch.nn.functional as F
from PIL import Image
import torchvision.transforms.functional as TF
import os
from pathlib import Path

# Class definitions from your CNN.py
idx_to_classes = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot', 
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Background_without_leaves',
    5: 'Blueberry___healthy',
    6: 'Cherry___Powdery_mildew',
    7: 'Cherry___healthy',
    8: 'Corn___Cercospora_leaf_spot Gray_leaf_spot',
    9: 'Corn___Common_rust',
    10: 'Corn___Northern_Leaf_Blight',
    11: 'Corn___healthy',
    12: 'Grape___Black_rot',
    13: 'Grape___Esca_(Black_Measles)',
    14: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    15: 'Grape___healthy',
    16: 'Orange___Haunglongbing_(Citrus_greening)',
    17: 'Peach___Bacterial_spot',
    18: 'Peach___healthy',
    19: 'Pepper,_bell___Bacterial_spot',
    20: 'Pepper,_bell___healthy',
    21: 'Potato___Early_blight',
    22: 'Potato___Late_blight',
    23: 'Potato___healthy',
    24: 'Raspberry___healthy',
    25: 'Soybean___healthy',
    26: 'Squash___Powdery_mildew',
    27: 'Strawberry___Leaf_scorch',
    28: 'Strawberry___healthy',
    29: 'Tomato___Bacterial_spot',
    30: 'Tomato___Early_blight',
    31: 'Tomato___Late_blight',
    32: 'Tomato___Leaf_Mold',
    33: 'Tomato___Septoria_leaf_spot',
    34: 'Tomato___Spider_mites Two-spotted_spider_mite',
    35: 'Tomato___Target_Spot',
    36: 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    37: 'Tomato___Tomato_mosaic_virus',
    38: 'Tomato___healthy'
}

# Healthy class indices (from your main.py)
HEALTHY_INDICES = [3, 5, 7, 11, 15, 18, 20, 23, 24, 25, 28, 38]

def load_model():
    """Load your pre-trained CNN model"""
    # Import your CNN class
    import sys
    sys.path.append('ai-service')
    from CNN import CNN
    
    model = CNN(39)
    model.load_state_dict(torch.load('ai-service/plant_disease_model_1_latest.pt', 
                                   map_location=torch.device('cpu'), weights_only=False))
    model.eval()
    return model

def map_filename_to_class(filename):
    """
    Map test image filename to class index based on naming pattern
    """
    filename_lower = filename.lower()
    
    # Manual mapping based on your test image filenames
    filename_to_class = {
        'apple_scab.jpg': 0,
        'apple_black_rot.jpg': 1, 
        'apple_ceder_apple_rust.jpg': 2,
        'apple_healthy.jpg': 3,
        'background_without_leaves.jpg': 4,
        'blueberry_healthy.jpg': 5,
        'cherry_powdery_mildew.jpg': 6,
        'cherry_healthy.jpg': 7,
        'corn_cercospora_leaf.jpg': 8,
        'corn_common_rust.jpg': 9,
        'corn_northen_leaf_blight.jpg': 10,
        'corn_healthy.jpg': 11,
        'grape_black_rot.jpg': 12,
        'grape_esca.jpg': 13,
        'grape_leaf_blight.jpg': 14,
        'grape_healthy.jpg': 15,
        'orange_haunglongbing.jpg': 16,
        'peach_bacterial_spot.jpg': 17,
        'peach_healthy.jpg': 18,
        'pepper_bacterial_spot.jpg': 19,
        'pepper_bell_healthy.jpg': 20,
        'potato_early_blight.jpg': 21,
        'potato_late_blight.jpg': 22,
        'potato_healthy.jpg': 23,
        'raspberry_healthy.jpg': 24,
        'soyaben healthy.jpg': 25,  # Note: space in filename
        'squash_powdery_mildew.jpg': 26,
        'starwberry_leaf_scorch.jpg': 27,  # Note: typo in filename
        'starwberry_healthy.jpg': 28,     # Note: typo in filename
        'tomato_bacterial_spot.jpg': 29,
        'tomato-bacterial-spot2.jpg': 29,  # Additional tomato bacterial spot
        'tomato_early_blight.jpg': 30,
        'tomato_late_blight.jpg': 31,
        'tomato_leaf_mold.jpg': 32,
        'tomato-mold.jpg': 32,  # Additional tomato mold
        'tomato_septoria_leaf_spot.jpg': 33,
        'tomato_spider_mites_two_spotted_spider_mites.jpg': 34,
        'tomato_target_spot.jpg': 35,
        'tomato_yellow_leaf_curl_virus.jpg': 36,
        'tomato-leaf-curl-virus3.jpg': 36,  # Additional curl virus
        'tomato_yellow_leaf_curl_virus2.jpg': 36,  # Additional curl virus
        'tomato_mosaic_virus.jpg': 37,
        'tomato_healthy.jpg': 38
    }
    
    return filename_to_class.get(filename_lower, -1)

def evaluate_test_dataset(model, test_data_path):
    """
    Evaluate model on test dataset and return predictions
    
    Args:
        model: Trained CNN model
        test_data_path: Path to test images folder
        
    Returns:
        y_true: Actual class labels
        y_pred: Predicted class labels
        class_counts: Number of samples per class
    """
    y_true = []
    y_pred = []
    class_counts = {i: 0 for i in range(39)}
    
    test_path = Path(test_data_path)
    if not test_path.exists():
        print(f"ERROR: Test data path not found: {test_data_path}")
        print("Please provide the path to your test dataset")
        return None, None, None
    
    # Get all image files
    image_extensions = ['*.jpg', '*.jpeg', '*.JPG', '*.JPEG', '*.png', '*.PNG']
    image_files = []
    for ext in image_extensions:
        image_files.extend(list(test_path.glob(ext)))
    
    print(f"Found {len(image_files)} test images")
    
    for img_path in image_files:
        filename = img_path.name
        
        # Skip readme files
        if filename.lower().startswith('readme'):
            continue
            
        # Map filename to true class
        true_class = map_filename_to_class(filename)
        if true_class == -1:
            print(f"Warning: Could not map filename '{filename}' to class")
            continue
        
        try:
            # Load and preprocess image
            image = Image.open(img_path).convert('RGB')
            image = image.resize((224, 224))
            input_tensor = TF.to_tensor(image).unsqueeze(0)
            
            # Get prediction
            with torch.no_grad():
                output = model(input_tensor)
                predicted_class = torch.argmax(output, dim=1).item()
            
            y_true.append(true_class)
            y_pred.append(predicted_class)
            class_counts[true_class] = class_counts.get(true_class, 0) + 1
            
            print(f"✓ {filename}: True={idx_to_classes[true_class].split('___')[1]}, "
                  f"Pred={idx_to_classes[predicted_class].split('___')[1]}, "
                  f"{'✓' if true_class == predicted_class else '✗'}")
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            continue
    
    return np.array(y_true), np.array(y_pred), class_counts

def generate_confusion_matrix_analysis(y_true, y_pred):
    """
    Generate comprehensive confusion matrix analysis
    
    Args:
        y_true: Array of actual class labels
        y_pred: Array of predicted class labels
    """
    
    # Calculate confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    
    # Calculate metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision, recall, f1, support = precision_recall_fscore_support(y_true, y_pred, average=None)
    
    print("="*80)
    print("CONFUSION MATRIX ANALYSIS - PLANT DISEASE CLASSIFICATION")
    print("="*80)
    
    # Overall metrics
    print(f"\nOVERALL PERFORMANCE:")
    print(f"Total Test Samples: {len(y_true)}")
    print(f"Overall Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    print(f"Average Precision: {np.mean(precision):.4f}")
    print(f"Average Recall: {np.mean(recall):.4f}")
    print(f"Average F1-Score: {np.mean(f1):.4f}")
    
    # Class-wise analysis
    print(f"\nCLASS-WISE PERFORMANCE:")
    print("-"*120)
    print(f"{'Class':<50} {'Samples':<8} {'Correct':<8} {'Wrong':<8} {'Precision':<10} {'Recall':<10} {'F1-Score':<10}")
    print("-"*120)
    
    class_correct = {}
    class_wrong = {}
    
    for i in range(39):
        if i < len(support):
            correct = np.sum((y_true == i) & (y_pred == i))
            wrong = support[i] - correct
            class_correct[i] = correct
            class_wrong[i] = wrong
            
            class_name = idx_to_classes[i].replace('___', ' - ')[:48]
            print(f"{class_name:<50} {support[i]:<8} {correct:<8} {wrong:<8} "
                  f"{precision[i]:<10.4f} {recall[i]:<10.4f} {f1[i]:<10.4f}")
    
    # Confusion Matrix Table
    print(f"\nCONFUSION MATRIX (39x39):")
    print("Rows = Actual Classes, Columns = Predicted Classes")
    print("-"*80)
    
    # Create DataFrame for better visualization
    class_names_short = [name.split('___')[1] if '___' in name else name for name in idx_to_classes.values()]
    cm_df = pd.DataFrame(cm, index=class_names_short, columns=class_names_short)
    
    # Save detailed confusion matrix
    cm_df.to_csv('confusion_matrix_detailed.csv')
    print("Detailed confusion matrix saved to 'confusion_matrix_detailed.csv'")
    
    # Most confused classes
    print(f"\nMOST COMMON MISCLASSIFICATIONS:")
    print("-"*60)
    misclassifications = []
    for i in range(39):
        for j in range(39):
            if i != j and cm[i, j] > 0:
                misclassifications.append((cm[i, j], i, j))
    
    misclassifications.sort(reverse=True)
    for count, true_class, pred_class in misclassifications[:10]:
        true_name = idx_to_classes[true_class].replace('___', ' - ')
        pred_name = idx_to_classes[pred_class].replace('___', ' - ')
        print(f"{count:3d} samples: {true_name} → {pred_name}")
    
    return cm, class_correct, class_wrong

def plot_confusion_matrix(cm, save_path='confusion_matrix_heatmap.png'):
    """Plot and save confusion matrix heatmap"""
    plt.figure(figsize=(20, 16))
    
    class_names_short = [name.split('___')[1] if '___' in name else name[:10] 
                        for name in idx_to_classes.values()]
    
    sns.heatmap(cm, annot=False, cmap='Blues', 
                xticklabels=class_names_short, 
                yticklabels=class_names_short,
                cbar_kws={'label': 'Number of Samples'})
    
    plt.title('Confusion Matrix - Plant Disease Classification (39 Classes)', fontsize=16)
    plt.xlabel('Predicted Class', fontsize=14)
    plt.ylabel('Actual Class', fontsize=14)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"Confusion matrix heatmap saved to: {save_path}")

def main():
    """
    Main function to run confusion matrix analysis
    
    TO USE THIS SCRIPT:
    1. Ensure you have your test dataset organized in folders by class name
    2. Update the test_data_path below to point to your test data
    3. Run this script to get complete confusion matrix analysis
    """
    
    print("PLANT DISEASE CLASSIFICATION - CONFUSION MATRIX ANALYSIS")
    print("="*60)
    
    # Using the actual test_images folder
    test_data_path = "test_images"
    
    # Load model
    try:
        model = load_model()
        print("✓ Model loaded successfully")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return
    
    # Evaluate on test data
    print("Evaluating model on test dataset...")
    y_true, y_pred, class_counts = evaluate_test_dataset(model, test_data_path)
    
    if y_true is None:
        print("\n" + "="*80)
        print("NO TEST DATA FOUND IN YOUR PROJECT")
        print("="*80)
        print("To generate actual confusion matrix, you need:")
        print("1. Test dataset organized by class folders")
        print("2. Update test_data_path in this script")
        print("3. Run evaluation on your test images")
        print("\nThis script provides the framework for analysis once you have test data.")
        return
    
    # Generate analysis
    cm, class_correct, class_wrong = generate_confusion_matrix_analysis(y_true, y_pred)
    
    # Plot confusion matrix
    plot_confusion_matrix(cm)
    
    # Generate classification report
    class_names = [idx_to_classes[i].replace('___', '_') for i in range(39)]
    report = classification_report(y_true, y_pred, target_names=class_names, output_dict=True)
    
    # Save results
    results = {
        'confusion_matrix': cm.tolist(),
        'y_true': y_true.tolist(),
        'y_pred': y_pred.tolist(),
        'class_correct': class_correct,
        'class_wrong': class_wrong,
        'classification_report': report,
        'class_counts': class_counts
    }
    
    import json
    with open('confusion_matrix_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*80)
    print("ANALYSIS COMPLETE")
    print("="*80)
    print("Files generated:")
    print("- confusion_matrix_detailed.csv")
    print("- confusion_matrix_heatmap.png") 
    print("- confusion_matrix_results.json")

if __name__ == "__main__":
    main()
