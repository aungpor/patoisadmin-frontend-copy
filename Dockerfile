FROM node:14.17-alpine
WORKDIR /app
COPY package.json ./
COPY /ckeditor5-custom ./
RUN npm install
COPY . .
 
# Expose the port.
EXPOSE 3000
# Run the application.
CMD ["npm", "start"]
