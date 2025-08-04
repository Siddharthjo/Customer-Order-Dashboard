import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  message: string;
  data?: any;
}

class ApiTester {
  private results: TestResult[] = [];

  async runTests() {
    console.log('🧪 Starting Customer API Tests...\n');

    await this.testHealthCheck();
    await this.testGetAllCustomers();
    await this.testGetCustomersWithPagination();
    await this.testGetCustomersWithSearch();
    await this.testGetCustomerById();
    await this.testGetCustomerByInvalidId();
    await this.testGetNonExistentCustomer();

    this.printResults();
  }

  private async testHealthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      this.addResult('GET /api/health', response.status, true, 'Health check passed', response.data);
    } catch (error: any) {
      this.addResult('GET /api/health', error.response?.status || 0, false, 'Health check failed');
    }
  }

  private async testGetAllCustomers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      const isValid = response.data.success && Array.isArray(response.data.data);
      this.addResult('GET /api/customers', response.status, isValid, 
        `Retrieved ${response.data.data?.length || 0} customers`, response.data);
    } catch (error: any) {
      this.addResult('GET /api/customers', error.response?.status || 0, false, 
        error.response?.data?.message || 'Request failed');
    }
  }

  private async testGetCustomersWithPagination() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers?page=1&limit=5`);
      const hasValidPagination = response.data.pagination && 
        response.data.pagination.page === 1 && 
        response.data.pagination.limit === 5;
      this.addResult('GET /api/customers?page=1&limit=5', response.status, hasValidPagination, 
        'Pagination test passed', response.data.pagination);
    } catch (error: any) {
      this.addResult('GET /api/customers?page=1&limit=5', error.response?.status || 0, false, 
        'Pagination test failed');
    }
  }

  private async testGetCustomersWithSearch() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers?search=john`);
      this.addResult('GET /api/customers?search=john', response.status, response.data.success, 
        `Search returned ${response.data.data?.length || 0} results`);
    } catch (error: any) {
      this.addResult('GET /api/customers?search=john', error.response?.status || 0, false, 
        'Search test failed');
    }
  }

  private async testGetCustomerById() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/1`);
      const hasOrderCount = response.data.data && 
        typeof response.data.data.order_count === 'number';
      this.addResult('GET /api/customers/1', response.status, hasOrderCount, 
        'Customer details with order count retrieved', {
          id: response.data.data?.id,
          order_count: response.data.data?.order_count,
          total_spent: response.data.data?.total_spent
        });
    } catch (error: any) {
      this.addResult('GET /api/customers/1', error.response?.status || 0, false, 
        error.response?.data?.message || 'Request failed');
    }
  }

  private async testGetCustomerByInvalidId() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/invalid`);
      this.addResult('GET /api/customers/invalid', response.status, false, 
        'Should have returned 400 for invalid ID');
    } catch (error: any) {
      const isCorrectError = error.response?.status === 400;
      this.addResult('GET /api/customers/invalid', error.response?.status || 0, isCorrectError, 
        isCorrectError ? 'Correctly returned 400 for invalid ID' : 'Unexpected error response');
    }
  }

  private async testGetNonExistentCustomer() {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/99999`);
      this.addResult('GET /api/customers/99999', response.status, false, 
        'Should have returned 404 for non-existent customer');
    } catch (error: any) {
      const isCorrectError = error.response?.status === 404;
      this.addResult('GET /api/customers/99999', error.response?.status || 0, isCorrectError, 
        isCorrectError ? 'Correctly returned 404 for non-existent customer' : 'Unexpected error response');
    }
  }

  private addResult(endpoint: string, status: number, success: boolean, message: string, data?: any) {
    this.results.push({
      endpoint,
      method: endpoint.split(' ')[0],
      status,
      success,
      message,
      data
    });
  }

  private printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('=' .repeat(80));

    let passed = 0;
    let failed = 0;

    this.results.forEach((result, index) => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const statusCode = result.status ? `[${result.status}]` : '[ERR]';
      
      console.log(`${index + 1}. ${status} ${statusCode} ${result.endpoint}`);
      console.log(`   ${result.message}`);
      
      if (result.data && Object.keys(result.data).length > 0) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2).substring(0, 100)}...`);
      }
      console.log('');

      if (result.success) passed++;
      else failed++;
    });

    console.log('=' .repeat(80));
    console.log(`📈 Results: ${passed} passed, ${failed} failed`);
    console.log(`🎯 Success Rate: ${Math.round((passed / this.results.length) * 100)}%`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ApiTester();
  tester.runTests().catch(console.error);
}

export default ApiTester;