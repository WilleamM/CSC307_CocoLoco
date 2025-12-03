# Testing Profile Picture Upload

## Prerequisites

1. **MongoDB Connection**: Make sure you have a `.env` file in `packages/express-backend/` with:
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

2. **Node.js**: Ensure Node.js >= 20 is installed

## Method 1: Test via Frontend (Easiest)

### Step 1: Start the servers
```bash
npm run dev
```
This starts both backend (port 8000) and frontend (usually port 5173)

### Step 2: Test the upload
1. Open your browser to `http://localhost:5173` (or the port Vite shows)
2. Navigate to a user's profile page: `http://localhost:5173/profile/{userId}`
   - You'll need a valid user ID from your database
   - Or create a new user first via signup
3. On the profile page, you should see a file input below the profile picture
4. Click the file input and select an image file (JPEG, PNG, GIF, or WebP)
5. The page should reload and show the new avatar

### Step 3: Verify
- Check that the avatar displays correctly
- Check the browser console for any errors
- Check the backend terminal for success messages

## Method 2: Test via API (Using curl)

### Step 1: Start the backend only
```bash
npm run server
# OR
cd packages/express-backend && npx nodemon backend.js
```

### Step 2: Get a user ID
```bash
# Get all users to find an ID
curl http://localhost:8000/users/
```

### Step 3: Upload an avatar
```bash
# Replace USER_ID with an actual user ID from step 2
# Replace /path/to/image.jpg with your image path
curl -X POST http://localhost:8000/users/USER_ID/avatar \
  -F "avatar=@/path/to/image.jpg"
```

**Example:**
```bash
curl -X POST http://localhost:8000/users/671eb54c8ddad1d8cf7a0012/avatar \
  -F "avatar=@./test-image.jpg"
```

**Expected Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatarUrl": "/users/671eb54c8ddad1d8cf7a0012/avatar"
}
```

### Step 4: Retrieve the avatar
```bash
# View the uploaded avatar
curl http://localhost:8000/users/USER_ID/avatar --output downloaded-avatar.jpg

# Or open in browser:
# http://localhost:8000/users/USER_ID/avatar
```

## Method 3: Test via Postman

1. **Create a POST request**
   - URL: `http://localhost:8000/users/{userId}/avatar`
   - Method: POST
   - Body: form-data
   - Key: `avatar` (type: File)
   - Value: Select an image file

2. **Send the request** and check the response

3. **Create a GET request**
   - URL: `http://localhost:8000/users/{userId}/avatar`
   - Method: GET
   - Should return the image

## Testing Error Cases

### Test 1: Invalid file type
```bash
# Try uploading a text file
curl -X POST http://localhost:8000/users/USER_ID/avatar \
  -F "avatar=@./test.txt"
```
**Expected**: 400 error with message "Invalid file type. Only images are allowed."

### Test 2: File too large
```bash
# Create a large file (over 5MB) and try to upload
# Expected: 400 error with message "File too large. Maximum size is 5MB."
```

### Test 3: No file uploaded
```bash
curl -X POST http://localhost:8000/users/USER_ID/avatar
```
**Expected**: 400 error with message "No file uploaded."

### Test 4: Invalid user ID
```bash
curl -X POST http://localhost:8000/users/invalid-id/avatar \
  -F "avatar=@./test-image.jpg"
```
**Expected**: 404 error with message "User not found"

### Test 5: Get avatar for user without avatar
```bash
curl http://localhost:8000/users/USER_ID/avatar
```
**Expected**: Redirects to default placeholder image

## Verification Checklist

- [ ] Avatar uploads successfully
- [ ] Avatar displays correctly on profile page
- [ ] Avatar displays correctly on front page (suggested users)
- [ ] Invalid file types are rejected
- [ ] Files over 5MB are rejected
- [ ] Missing avatars show default placeholder
- [ ] Avatar URL is correctly set in user document
- [ ] Avatar can be retrieved via GET endpoint
- [ ] No console errors in browser
- [ ] No errors in backend terminal

## Debugging Tips

1. **Check backend logs**: Look for MongoDB connection messages and any errors
2. **Check browser console**: Look for network errors or JavaScript errors
3. **Check MongoDB**: Verify the user document has `avatar`, `avatarContentType`, and `avatarUrl` fields
4. **Test with different image formats**: Try JPEG, PNG, GIF, WebP
5. **Check file sizes**: Try small (< 1MB) and large (> 5MB) files

## Common Issues

1. **"User not found"**: Make sure you're using a valid user ID
2. **"No file uploaded"**: Check that the form field name is `avatar` (not `image` or `file`)
3. **Image doesn't display**: Check that `avatarUrl` is correctly constructed in frontend
4. **CORS errors**: Make sure CORS is enabled in backend (it should be)
5. **MongoDB connection errors**: Check your `.env` file and MongoDB connection string

