import { UniqueIdentifier } from '@dnd-kit/core';
import { LexoRank } from 'lexorank';

interface HasRank {
    rank: string;
}

interface HasId {
    id: UniqueIdentifier;
}

interface SortablePayload<T extends HasId> {
    prevEntity?: T;
    entity: T;
    nextEntity?: T;
}

export const sortByLexoRankAsc = (a: HasRank, b: HasRank): number => {
    if (!a.rank && b.rank) {
        return -1;
    }
    if (a.rank && !b.rank) {
        return 1;
    }

    if (!a.rank || !b.rank) {
        return 0;
    }

    return a.rank.localeCompare(b.rank);
};

export const createSortablePayloadByIndex = <T extends HasId & HasRank>(
    items: T[],
    oldIndex: number,
    newIndex: number
): SortablePayload<T> => {
    let input: SortablePayload<T>;
    const entity = items[oldIndex];
    if (newIndex === 0) {
        const nextEntity = items[newIndex];
        input = {
            prevEntity: undefined,
            entity: entity,
            nextEntity: nextEntity,
        };
    } else if (newIndex === items.length - 1) {
        const prevEntity = items[newIndex];
        input = {
            prevEntity: prevEntity,
            entity: entity,
            nextEntity: undefined,
        };
    } else {
        const prevEntity = items[newIndex];
        const offset = oldIndex > newIndex ? -1 : 1;
        const nextEntity = items[newIndex + offset];
        input = {
            prevEntity: prevEntity,
            entity: entity,
            nextEntity: nextEntity,
        };
    }

    return input;
};

export const getBetweenRankAsc = <T extends HasId & HasRank>(
    payload: SortablePayload<T>
): LexoRank => {
    const { prevEntity, entity, nextEntity } = payload;
    let newLexoRank: LexoRank;
    if (!prevEntity && !!nextEntity) {
        newLexoRank = LexoRank.parse(nextEntity.rank).genPrev();
    } else if (!nextEntity && !!prevEntity) {
        newLexoRank = LexoRank.parse(prevEntity.rank).genNext();
    } else if (!!prevEntity && !!nextEntity) {
        newLexoRank = LexoRank.parse(nextEntity.rank).between(
            LexoRank.parse(prevEntity.rank)
        );
    } else {
        newLexoRank = LexoRank.parse(entity.rank).genNext();
    }

    return newLexoRank;
};
