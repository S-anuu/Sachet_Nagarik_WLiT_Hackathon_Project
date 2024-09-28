document.addEventListener('DOMContentLoaded', () => {
    // Handle Read More click
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const description = document.getElementById(targetId);
            if (description.style.display === 'none') {
                description.style.display = 'block';
                button.textContent = 'Read Less';
            } else {
                description.style.display = 'none';
                button.textContent = 'Read More';
            }
        });
    });

    // Handle Support and Critic clicks
    document.querySelectorAll('.support').forEach(support => {
        support.addEventListener('click', () => {
            let count = parseInt(support.getAttribute('data-support'));
            count++;
            support.setAttribute('data-support', count);
            support.querySelector('.support2').textContent = `Support (${count})`;
        });
    });

    document.querySelectorAll('.critic').forEach(critic => {
        critic.addEventListener('click', () => {
            let count = parseInt(critic.getAttribute('data-critic'));
            count++;
            critic.setAttribute('data-critic', count);
            critic.querySelector('.critic2').textContent = `Critic (${count})`;
        });
    });
});
