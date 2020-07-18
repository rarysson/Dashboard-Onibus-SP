function contains(circle_center, circle_radius, point) {
    const result =
        Math.pow(circle_center.x - point.x, 2) +
        Math.pow(circle_center.y - point.y, 2);

    return result <= Math.pow(circle_radius, 2);
}

export default contains;
