FROM public.ecr.aws/lambda/python:3.11

# Set working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies with specific versions and verbose output
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --verbose -r requirements.txt

# Verify installation
RUN pip list | grep -E "(fastapi|mangum|sqlalchemy|pymysql|pydantic)"

# Copy the rest of the application code
COPY . .

# Set the CMD to your handler
CMD ["main.handler"]