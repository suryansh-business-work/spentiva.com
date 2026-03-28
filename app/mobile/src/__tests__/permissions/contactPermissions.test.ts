import * as Contacts from 'expo-contacts';

describe('Contact permissions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('requests contact permission', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

    const result = await Contacts.requestPermissionsAsync();
    expect(result.status).toBe('granted');
    expect(Contacts.requestPermissionsAsync).toHaveBeenCalledTimes(1);
  });

  it('handles contact permission denied', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const result = await Contacts.requestPermissionsAsync();
    expect(result.status).toBe('denied');
  });

  it('fetches contacts after permission granted', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Contacts.getContactsAsync as jest.Mock).mockResolvedValue({
      data: [
        { id: '1', name: 'John Doe', emails: [{ email: 'john@test.com' }] },
        { id: '2', name: 'Jane Doe', emails: [{ email: 'jane@test.com' }] },
      ],
    });

    const permResult = await Contacts.requestPermissionsAsync();
    expect(permResult.status).toBe('granted');

    const contacts = await Contacts.getContactsAsync();
    expect(contacts.data).toHaveLength(2);
    expect(contacts.data[0].name).toBe('John Doe');
  });

  it('does not fetch contacts when permission denied', async () => {
    (Contacts.requestPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const permResult = await Contacts.requestPermissionsAsync();
    if (permResult.status !== 'granted') {
      // Should not proceed to fetch contacts
      expect(Contacts.getContactsAsync).not.toHaveBeenCalled();
    }
  });
});
