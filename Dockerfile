# Step 1. Build the React App
FROM node:16 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./ 
RUN npm run build

# Step 2. Serve the React App using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

