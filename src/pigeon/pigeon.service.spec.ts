import { Test, TestingModule } from '@nestjs/testing';
import { PigeonService } from './services/pigeon.service';
import { RegistrationNumberService } from './services/registration-number.service';
import { PigeonRepository } from './repositories/pigeon.repository';
import { FirebaseService } from '../core/services/firebase.service';
import { ConfigService } from '@nestjs/config';
import { PigeonGender, PigeonStatus } from './enums/pigeon.enum';

describe('PigeonService', () => {
  let service: PigeonService;

  const mockPigeonRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
    count: jest.fn(),
    findByRingNo: jest.fn(),
    findByDocumentationNo: jest.fn(),
    findAlivePigeons: jest.fn(),
    findAliveParents: jest.fn(),
    countByStatus: jest.fn(),
    findByYearOfBirth: jest.fn(),
  };

  const mockRegistrationNumberService = {
    generateRegistrationNumber: jest.fn(),
    validateRegistrationNumber: jest.fn(),
    parseRegistrationNumber: jest.fn(),
  };

  const mockFirebaseService = {
    getDatabase: jest.fn(),
    getAuth: jest.fn(),
    getFirestore: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PigeonService,
        {
          provide: PigeonRepository,
          useValue: mockPigeonRepository,
        },
        {
          provide: RegistrationNumberService,
          useValue: mockRegistrationNumberService,
        },
        {
          provide: FirebaseService,
          useValue: mockFirebaseService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PigeonService>(PigeonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pigeon', async () => {
    const createPigeonDto = {
      name: 'Test Pigeon',
      gender: PigeonGender.MALE,
      status: PigeonStatus.ALIVE,
      documentationNo: '2025-A-001',
      ringNo: '123456',
      ringColor: 'Blue',
      fatherName: 'Father Pigeon',
      motherName: 'Mother Pigeon',
      yearOfBirth: '2025',
    };

    const expectedPigeon = {
      id: 'test-id',
      ...createPigeonDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPigeonRepository.findByRingNo.mockResolvedValue(null);
    mockPigeonRepository.findByDocumentationNo.mockResolvedValue(null);
    mockPigeonRepository.create.mockResolvedValue(expectedPigeon);
    mockRegistrationNumberService.validateRegistrationNumber.mockReturnValue(true);

    const result = await service.create(createPigeonDto);

    expect(result).toEqual(expectedPigeon);
    expect(mockPigeonRepository.create).toHaveBeenCalledWith(createPigeonDto);
  });

  it('should find all pigeons', async () => {
    const expectedPigeons = [
      {
        id: '1',
        name: 'Pigeon 1',
        gender: PigeonGender.MALE,
        status: PigeonStatus.ALIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Pigeon 2',
        gender: PigeonGender.FEMALE,
        status: PigeonStatus.ALIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPigeonRepository.findAll.mockResolvedValue(expectedPigeons);

    const result = await service.findAll({} as any);

    expect(result).toEqual(expectedPigeons);
    expect(mockPigeonRepository.findAll).toHaveBeenCalled();
  });

  it('should find one pigeon by id', async () => {
    const expectedPigeon = {
      id: 'test-id',
      name: 'Test Pigeon',
      gender: PigeonGender.MALE,
      status: PigeonStatus.ALIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPigeonRepository.findById.mockResolvedValue(expectedPigeon);

    const result = await service.findOne('test-id');

    expect(result).toEqual(expectedPigeon);
    expect(mockPigeonRepository.findById).toHaveBeenCalledWith('test-id');
  });

  it('should count pigeons', async () => {
    const expectedCount = 5;

    mockPigeonRepository.count.mockResolvedValue(expectedCount);

    const result = await service.count();

    expect(result).toBe(expectedCount);
    expect(mockPigeonRepository.count).toHaveBeenCalled();
  });

  it('should find alive pigeons', async () => {
    const expectedPigeons = [
      {
        id: '1',
        name: 'Alive Pigeon',
        gender: PigeonGender.MALE,
        status: PigeonStatus.ALIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockPigeonRepository.findAlivePigeons.mockResolvedValue(expectedPigeons);

    const result = await service.findAlivePigeons();

    expect(result).toEqual(expectedPigeons);
    expect(mockPigeonRepository.findAlivePigeons).toHaveBeenCalled();
  });

  it('should generate registration number', async () => {
    const yearOfBirth = '2025';
    const expectedRegistrationNumber = '2025-A-001';

    mockRegistrationNumberService.generateRegistrationNumber.mockResolvedValue(expectedRegistrationNumber);

    const result = await service.generateRegistrationNumber(yearOfBirth);

    expect(result).toBe(expectedRegistrationNumber);
    expect(mockRegistrationNumberService.generateRegistrationNumber).toHaveBeenCalledWith(yearOfBirth);
  });
});
