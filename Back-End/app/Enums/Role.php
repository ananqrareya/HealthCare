<?php

namespace App\Enums;

enum Role: int
{
    case Admin = 1;
    case Patient = 2;
    case Doctor = 3;
    case PharmacyUser = 4;
    case LaboratoryUser = 5;

    /**
     * Get the name of the role by ID.
     */
    public static function getNameById(int $id): ?string
    {
        return match ($id) {
            self::Admin->value => 'Admin',
            self::Patient->value => 'Patient',
            self::Doctor->value => 'Doctor',
            self::PharmacyUser->value => 'Pharmacy User',
            self::LaboratoryUser->value => 'Laboratory User',
            default => null,
        };
    }

    /**
     * Get the ID of the role by name.
     */
    public static function getIdByName(string $name): ?int
    {
        return match (strtolower($name)) {
            'admin' => self::Admin->value,
            'patient' => self::Patient->value,
            'doctor' => self::Doctor->value,
            'pharmacy user' => self::PharmacyUser->value,
            'laboratory user' => self::LaboratoryUser->value,
            default => null,
        };
    }
}
