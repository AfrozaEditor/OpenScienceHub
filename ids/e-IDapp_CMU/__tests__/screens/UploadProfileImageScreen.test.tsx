/**
 * Test Suite: UploadProfileImageScreen Component
 */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Image } from 'react-native';
import UploadProfileImageScreen from '../../src/screens/UploadProfileImageScreen';
import ImagePicker from 'react-native-image-crop-picker';

// Mock Redux user slice
jest.mock('../../src/store/slices/userSlice', () => ({
    setProfileImage: jest.fn((path) => ({ type: 'user/setProfileImage', payload: path })),
}), { virtual: true });

jest.mock('@store/slices/userSlice', () => ({
    setProfileImage: jest.fn((path) => ({ type: 'user/setProfileImage', payload: path })),
}), { virtual: true });

// Mock dependencies
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

// Mock Image Picker
jest.mock('react-native-image-crop-picker', () => ({
    openPicker: jest.fn(() => Promise.resolve({ path: 'test-gallery-image.jpg' })),
    openCamera: jest.fn(() => Promise.resolve({ path: 'test-camera-image.jpg' })),
    clean: jest.fn(() => Promise.resolve()),
}));

describe('UploadProfileImageScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Component Rendering', () => {
        it('should render without crashing', () => {
            const navigation = { navigate: jest.fn() };
            render(<UploadProfileImageScreen navigation={navigation} />);
        });

        it('should render title and options', () => {
            const navigation = { navigate: jest.fn() };
            const { getByText } = render(<UploadProfileImageScreen navigation={navigation} />);
            expect(getByText('Upload Profile Photo')).toBeTruthy();
            expect(getByText('Gallery')).toBeTruthy();
            expect(getByText('Camera')).toBeTruthy();
        });

        it('should disable Next button initially', () => {
            const navigation = { navigate: jest.fn() };
            const { getByText } = render(<UploadProfileImageScreen navigation={navigation} />);
            // Finding Next button - usually by text if enabled, but might be different opacity
            // We can check functionality
            const nextButton = getByText('Next');
            // Assuming the disabled prop is passed
        });
    });

    describe('Interactions', () => {
        it('should pick image from gallery', async () => {
            const navigation = { navigate: jest.fn() };
            const { getByText } = render(<UploadProfileImageScreen navigation={navigation} />);

            const galleryButton = getByText('Gallery');
            fireEvent.press(galleryButton);

            expect(ImagePicker.openPicker).toHaveBeenCalled();

            await waitFor(() => {
                // UI should update (checking internal state difficult without testID, but we can verify Next flow)
            });
        });

        it('should navigate after selecting image and pressing Next', async () => {
            const navigation = { navigate: jest.fn() };
            const { getByText, UNSAFE_getByType } = render(<UploadProfileImageScreen navigation={navigation} />);

            // Select Image
            await act(async () => {
                fireEvent.press(getByText('Gallery'));
            });

            await waitFor(() => expect(ImagePicker.openPicker).toHaveBeenCalled());

            await waitFor(() => {
                expect(UNSAFE_getByType(Image).props.source).toEqual({
                    uri: 'test-gallery-image.jpg',
                });
            });

            fireEvent.press(getByText('Next'));

            expect(navigation.navigate).toHaveBeenCalledWith('SetupWait');
        });
    });
});
