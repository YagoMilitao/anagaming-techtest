// src/app/lib/__tests__/fetchOdds.test.ts

import { fetchOddsData, fetchOddById } from "@/app/lib/fetchOdds";
import { mockOddsDataSuccess, mockApiErrorResponse, mockEmptyData, mockSingleOddSuccess } from "@/test/mocks/api";



global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
  process.env.ODDS_API_KEY = 'TEST_API_KEY';
});

describe('fetchOddsData', () => {
  it('should fetch odds data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOddsDataSuccess), 
    });

    const result = await fetchOddsData();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual(mockOddsDataSuccess); 
    expect(result.error).toBeUndefined();
  });

  it('should return QUOTA_EXCEEDED error if API returns 403 with specific error code', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: () => Promise.resolve(JSON.stringify(mockApiErrorResponse)),
    });

    const result = await fetchOddsData();
    expect(result.data).toEqual([]);
    expect(result.error).toBe('QUOTA_EXCEEDED');
  });

  it('should return an empty array if API response is empty', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmptyData),
    });

    const result = await fetchOddsData();
    expect(result.data).toEqual([]);
    expect(result.error).toBeUndefined();
  });
});

describe('fetchOddById', () => {
    it('should fetch odd by ID successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSingleOddSuccess),
      });
  
      const result = await fetchOddById('soccer_epl', 'specific-event-123');
  
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result.data).toEqual(mockSingleOddSuccess);
      expect(result.error).toBeUndefined();
    });
});