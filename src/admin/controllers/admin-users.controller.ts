import { JwtAuthGuard } from '@/auth/guards';
import { Language } from '@/core/decorators';
import { ApiDataPageResponse, ApiDataResponse } from '@/core/decorators/api';
import { DataPageResponseDto, DataResponseDto, PageOptionsRequestDto } from '@/core/dtos';
import { UserLocale } from '@/core/enums';
import { ResponseFactory } from '@/core/utils';
import { AdminGuard } from '@/admin/guards';
import { UpdateUserAdminRequestDto } from '@/admin/dto/requests';
import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from '@/user/dto/responses';
import { UserService } from '@/user/services';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users (paginated, optional search)' })
  @ApiQuery({ name: 'q', required: false, description: 'Search name, email, or phone' })
  @ApiDataPageResponse(UserResponseDto)
  async listUsers(
    @Query() pageOptions: PageOptionsRequestDto,
    @Query('q') q?: string,
  ): Promise<DataPageResponseDto<UserResponseDto>> {
    const { items, total } = await this.userService.listUsersForAdmin(pageOptions, q);
    const data = items.map(
      (u) =>
        new UserResponseDto({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          country: u.country,
          avatar: u.avatar,
          provider: u.provider,
          status: u.status,
          role: u.role,
          emailVerified: u.emailVerified,
          lastLoginAt: u.lastLoginAt,
        }),
    );
    return ResponseFactory.dataPage(data, {
      page: pageOptions.page,
      size: pageOptions.size,
      itemCount: total,
    });
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by id (admin)' })
  @ApiDataResponse(UserResponseDto, HttpStatus.OK)
  async getUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<UserResponseDto>> {
    const user = await this.userService.findById(userId, locale);
    return ResponseFactory.data(
      new UserResponseDto({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        provider: user.provider,
        status: user.status,
        role: user.role,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
      }),
    );
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user role and/or status (admin)' })
  @ApiDataResponse(UserResponseDto, HttpStatus.OK)
  async patchUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() body: UpdateUserAdminRequestDto,
    @Language() locale: UserLocale,
  ): Promise<DataResponseDto<UserResponseDto>> {
    const user = await this.userService.updateUserAsAdmin(userId, body, locale);
    return ResponseFactory.data(
      new UserResponseDto({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        avatar: user.avatar,
        provider: user.provider,
        status: user.status,
        role: user.role,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
      }),
    );
  }

}
