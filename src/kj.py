import json
import matplotlib.pyplot as plt
import cv2
import numpy as np

# Configuration
input_json_path = r"C:\Users\stuar\Downloads\processed_processed_temp_temp_123_21_64f610084904a.json"
output_video_path = r"C:\Users\stuar\Downloads\skeleton_video.mp4"
frame_rate = 30  # FPS of the video

# Define skeleton connections based on CrowdPose
connections = [
    (13, 0), (13, 1), (0, 1),  # Torso
    (0, 6), (1, 7), (6, 7),    # Hips
    (0, 2), (2, 4),            # Left arm
    (1, 3), (3, 5),            # Right arm
    (6, 8), (8, 10),           # Left leg
    (7, 9), (9, 11),           # Right leg
    (13, 12)                   # Head
]

# Load JSON file
with open(input_json_path, 'r') as file:
    data = json.load(file)

# Determine video size (based on keypoints or assume default)
frame_width = 640
frame_height = 480

# Initialize video writer
fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for .mp4 files
out = cv2.VideoWriter(output_video_path, fourcc, frame_rate, (frame_width, frame_height))

# Create video frames
for frame_index, frame_data in enumerate(data):
    # Extract keypoints for the current frame
    keypoints = frame_data[0]["keypoints"]  # Assuming the keypoints are in this path

    # Create a blank image for the skeleton
    img = np.ones((frame_height, frame_width, 3), dtype=np.uint8) * 255

    # Draw keypoints
    for idx, (x, y) in enumerate(keypoints):
        cv2.circle(img, (int(x), int(y)), 5, (0, 0, 255), -1)  # Red dots for keypoints
        cv2.putText(img, str(idx), (int(x) + 5, int(y) + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)

    # Draw skeleton connections
    for start, end in connections:
        if start < len(keypoints) and end < len(keypoints):
            x1, y1 = keypoints[start]
            x2, y2 = keypoints[end]
            cv2.line(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)  # Green lines

    # Add timestamp to the frame
    timestamp = frame_index / frame_rate
    cv2.putText(img, f"Time: {timestamp:.2f}s", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2)

    # Write frame to video
    out.write(img)

# Release the video writer
out.release()
print(f"Skeleton video saved to {output_video_path}")
